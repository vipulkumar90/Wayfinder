using Wayfinder.DataLayer.Entity;

namespace Wayfinder.DataLayer.Repository.Interface
{
    public interface IAuthUserRepository
    {
        #region Create
        Task<bool> AddAsync(AuthUserEntity entity, CancellationToken cancellationToken = default);
        #endregion

        #region Read
        Task<AuthUserEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<AuthUserEntity?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
        #endregion

        #region Update
        Task<AuthUserEntity> UpdateAsync(AuthUserEntity entity, CancellationToken cancellationToken = default);
        #endregion

        #region Delete
        Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
        #endregion

        #region Password Management
        Task<bool> UpdatePasswordAsync(AuthUserEntity entity, CancellationToken cancellationToken = default);
        #endregion

        #region Login Tracking
        Task<bool> UpdateLastLoginAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<bool> IncrementFailedLoginAttemptsAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<bool> ResetFailedLoginAttemptsAsync(Guid userId, CancellationToken cancellationToken = default);
        #endregion


    }
}
