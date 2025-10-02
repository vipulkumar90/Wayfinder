using Wayfinder.DataLayer.Entity;
using Wayfinder.DataLayer.DataContext;
using Microsoft.EntityFrameworkCore;
using Wayfinder.DataLayer.Repository.Interface;

namespace Wayfinder.DataLayer.Repository
{
    public class AuthUserRepository : IAuthUserRepository
    {
        private readonly AuthUserContext _authUserContext;

        public AuthUserRepository(AuthUserContext authUserContext)
        {
            _authUserContext = authUserContext;
        }
        public async Task<bool> AddAsync(AuthUserEntity entity, CancellationToken cancellationToken = default)
        {
            try
            {
                // Check for existing user with same UserId
                var exists = await _authUserContext.AuthUsers.AnyAsync(u => u.UserId == entity.UserId, cancellationToken);
                if (exists)
                {
                    throw new InvalidOperationException($"An AuthUser with UserId {entity.UserId} already exists.");
                }
                // Add entity to context and save
                await _authUserContext.AuthUsers.AddAsync(entity, cancellationToken);
                return await _authUserContext.SaveChangesAsync(cancellationToken) > 0;
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

        public async Task<AuthUserEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                return await _authUserContext.AuthUsers.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public async Task<AuthUserEntity?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            try
            {
                return await _authUserContext.AuthUsers.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);
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

        public async Task<bool> UpdatePasswordAsync(AuthUserEntity entity, CancellationToken cancellationToken = default)
        {
            try
            {
                if (entity is null)
                {
                    throw new ArgumentNullException("AuthUserEntity cannot be null.", nameof(entity));
                }
                var existingUser = await _authUserContext.AuthUsers.FirstOrDefaultAsync(u => u.Id == entity.Id, cancellationToken);
                if (existingUser is null)
                {
                    throw new KeyNotFoundException($"AuthUser with Id {entity.Id} not found.");
                }
                if (entity.Id != existingUser.Id)
                {
                    throw new ArgumentException("Entity ID does not match the existing user ID.", nameof(entity));
                }
                existingUser.PasswordHash = entity.PasswordHash;
                existingUser.PasswordSalt = entity.PasswordSalt;
                existingUser.MustChangePassword = entity.MustChangePassword;
                return await _authUserContext.SaveChangesAsync(cancellationToken) > 0;
            }
            catch (Exception)
            {

                throw;
            }
        }
        
    }
}
