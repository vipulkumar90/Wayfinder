using Wayfinder.DataLayer.Entity;

namespace Wayfinder.DataLayer.Repository.Interface
{
    public interface IRefreshTokenRepository
    {
        /// <summary>
        /// Creates a new refresh token entity in the data store.
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns the created RefreshTokenEntity with any database-generated fields populated.</returns>
        Task<RefreshTokenEntity> CreateAsync(RefreshTokenEntity entity, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets a refresh token entity by its unique identifier.
        /// </summary>
        /// <param name="token"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns the RefreshTokenEntity if found; otherwise, null.</returns>
        Task<RefreshTokenEntity?> GetByTokenAsync(string token, CancellationToken cancellationToken = default);
        /// <summary>
        /// Revokes (deletes) a refresh token from the data store.
        /// </summary>
        /// <param name="token"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns true if the token was successfully revoked; otherwise, false.</returns>
        Task<bool> RevokeTokenAsync(string token, CancellationToken cancellationToken = default);
        /// <summary>
        /// Revokes all refresh tokens associated with a specific user.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns the number of tokens that were revoked.</returns>
        Task<int> RevokeAllTokensForUserAsync(Guid userId, CancellationToken cancellationToken = default);
        /// <summary>
        /// Deletes all expired refresh tokens from the data store periodically. (housekeeping method)
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns the number of expired tokens that were deleted.</returns>
        Task<int> DeleteExpiredTokensAsync(CancellationToken cancellationToken = default);
    }
}
