using Microsoft.EntityFrameworkCore;
using Wayfinder.DataLayer.DataContext;
using Wayfinder.DataLayer.Entity;
using Wayfinder.DataLayer.Repository.Interface;

namespace Wayfinder.DataLayer.Repository
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly AuthUserContext _authUserContext;

        public RefreshTokenRepository(AuthUserContext authUserContext)
        {
            _authUserContext = authUserContext;
        }
        public async Task<RefreshTokenEntity> CreateAsync(RefreshTokenEntity entity, CancellationToken cancellationToken = default)
        {
            try
            {
                if (entity is null)
                {
                    throw new ArgumentNullException(nameof(entity));
                }
                if (entity.UserId == Guid.Empty)
                {
                    throw new ArgumentException("Entity must have a valid UserId.", nameof(entity));
                }
                if (entity.Token is null)
                {
                    throw new ArgumentException("Entity must have a valid Token.", nameof(entity));
                }
                await _authUserContext.RefreshTokens.AddAsync(entity, cancellationToken);
                var isCreated = await _authUserContext.SaveChangesAsync(cancellationToken) > 0;
                if (!isCreated)
                {
                    throw new Exception("Failed to create the refresh token entity.");
                }
                return entity;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<int> DeleteExpiredTokensAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                // Fetch all the tokens that are expired
                var expiredTokens = _authUserContext.RefreshTokens.Where(rt => rt.ExpiresAt <= DateTime.UtcNow || rt.IsRevoked);
                _authUserContext.RefreshTokens.RemoveRange(expiredTokens);
                return await _authUserContext.SaveChangesAsync(cancellationToken);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<RefreshTokenEntity?> GetByTokenAsync(string token, CancellationToken cancellationToken = default)
        {
            try
            {
                var entity = await _authUserContext.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == token);
                if (entity is null)
                {
                    throw new ArgumentNullException("No entity found for the given refresh token");
                }
                return entity;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<int> RevokeAllTokensForUserAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            try
            {
                var tokens = await _authUserContext.RefreshTokens.Where(rt => rt.UserId == userId).ToListAsync(cancellationToken);
                foreach (var token in tokens)
                {
                    token.IsRevoked = true;
                }
                return await _authUserContext.SaveChangesAsync(cancellationToken);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<bool> RevokeTokenAsync(string token, CancellationToken cancellationToken = default)
        {
            try
            {
                var entity = await _authUserContext.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == token);
                if (entity == null)
                {
                    return false; // Token not found
                }
                entity.IsRevoked = true;
                return await _authUserContext.SaveChangesAsync(cancellationToken) > 1;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
