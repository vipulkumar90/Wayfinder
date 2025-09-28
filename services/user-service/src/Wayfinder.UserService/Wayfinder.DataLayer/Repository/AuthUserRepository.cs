using System;
using System.Collections.Generic;
using System.Text;
using System.Security.Cryptography;
using Wayfinder.DataLayer.Entity;
using Wayfinder.DataLayer.DataContext;
using Microsoft.EntityFrameworkCore;

namespace Wayfinder.DataLayer.Repository
{
    public class AuthUserRepository : IAuthUserRepository
    {
        private const int KEY_SIZE = 32; // 256 bits
        private readonly AuthUserContext _authUserContext;

        public AuthUserRepository(AuthUserContext authUserContext)
        {
            _authUserContext = authUserContext;
        }
        public async Task<AuthUserEntity> CreateAsync(AuthUserEntity entity, String rawPassword, CancellationToken cancellationToken = default)
        {
            try
            {
                if (entity is null)
                {
                    throw new ArgumentNullException(nameof(entity));
                }

                // Ensure password hash and salt are generated
                if (string.IsNullOrWhiteSpace(entity.PasswordHash) || string.IsNullOrWhiteSpace(entity.PasswordSalt))
                {
                    // Using PBKDF2 for hashing
                    var saltBytes = RandomNumberGenerator.GetBytes(KEY_SIZE);
                    entity.PasswordSalt = Convert.ToBase64String(saltBytes);
                    entity.PasswordHash = Convert.ToBase64String(GeneratePasswordHash(rawPassword, saltBytes));
                }

                // Ensure Id is set
                if (entity.Id == Guid.Empty)
                {
                    throw new ArgumentException("Entity must have a valid Id.", nameof(entity));
                }

                // Check for existing user with same Id
                var exists = await _authUserContext.AuthUsers.AnyAsync(u => u.Id == entity.Id, cancellationToken);
                if (exists)
                {
                    throw new InvalidOperationException($"An AuthUser with Id {entity.Id} already exists.");
                }

                // Add entity to context and save
                await _authUserContext.AuthUsers.AddAsync(entity, cancellationToken);
                await _authUserContext.SaveChangesAsync(cancellationToken);

                return entity;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var user = await _authUserContext.AuthUsers.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
                if (user is null)
                {
                    return false; // User not found
                }
                _authUserContext.AuthUsers.Remove(user);
                return await _authUserContext.SaveChangesAsync(cancellationToken) > 0;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public Task<AuthUserEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                return _authUserContext.AuthUsers.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<bool> IncrementFailedLoginAttemptsAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            try
            {
                var user = await _authUserContext.AuthUsers.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
                if (user is null)
                {
                    throw new KeyNotFoundException($"AuthUser with Id {userId} not found.");
                }
                user.FailedLoginAttempts += 1;
                return await _authUserContext.SaveChangesAsync(cancellationToken) > 0;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<bool> ResetFailedLoginAttemptsAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            try
            {
                var user = await _authUserContext.AuthUsers.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
                if (user is null)
                {
                    throw new KeyNotFoundException($"AuthUser with Id {userId} not found.");
                }
                user.FailedLoginAttempts = 0;
                return await _authUserContext.SaveChangesAsync(cancellationToken) > 0;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<AuthUserEntity> UpdateAsync(AuthUserEntity entity, CancellationToken cancellationToken = default)
        {
            try
            {
                var existingUser = _authUserContext.AuthUsers.FirstOrDefaultAsync(u => u.Id == entity.Id, cancellationToken);
                if (existingUser is null)
                {
                    throw new KeyNotFoundException($"AuthUser with Id {entity.Id} not found.");
                }
                _authUserContext.AuthUsers.Update(entity);
                await _authUserContext.SaveChangesAsync(cancellationToken);
                return entity;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<bool> UpdateLastLoginAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            try
            {
                var user = await _authUserContext.AuthUsers.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
                if (user is null)
                {
                    throw new KeyNotFoundException($"AuthUser with Id {userId} not found.");
                }
                user.LastLoginAt = DateTime.UtcNow;
                return await _authUserContext.SaveChangesAsync(cancellationToken) > 0;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<bool> UpdatePasswordAsync(Guid userId, string newRawPassword, CancellationToken cancellationToken = default)
        {
            try
            {
                var user = await _authUserContext.AuthUsers.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
                if (user is null)
                {
                    throw new KeyNotFoundException($"AuthUser with Id {userId} not found.");
                }
                var saltBytes = RandomNumberGenerator.GetBytes(KEY_SIZE);
                user.PasswordSalt = Convert.ToBase64String(saltBytes);
                user.PasswordHash = Convert.ToBase64String(GeneratePasswordHash(newRawPassword, saltBytes));
                return await _authUserContext.SaveChangesAsync(cancellationToken) > 0;
            }
            catch (Exception)
            {

                throw;
            }
        }
        #region Private Methods
        private byte[] GeneratePasswordHash(string rawPassword, byte[] saltBytes)
        {
            return Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(rawPassword),
                saltBytes,
                100_000,
                HashAlgorithmName.SHA512,
                KEY_SIZE);
        }
        #endregion
    }
}
