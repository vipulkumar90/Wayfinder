using System;
using System.Collections.Generic;
using System.Text;
using Wayfinder.DataLayer.Entity;

namespace Wayfinder.DataLayer.Repository
{
    public interface IAuthUserRepository
    {
        #region Create
        Task<AuthUserEntity> CreateAsync(AuthUserEntity entity, string rawPassword, CancellationToken cancellationToken = default);
        #endregion

        #region Read
        Task<AuthUserEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        #endregion

        #region Update
        Task<AuthUserEntity> UpdateAsync(AuthUserEntity entity, CancellationToken cancellationToken = default);
        #endregion

        #region Delete
        Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
        #endregion

        #region Password Management
        Task<bool> UpdatePasswordAsync(Guid userId, string newRawPassword, CancellationToken cancellationToken = default);
        #endregion

        #region Login Tracking
        Task<bool> UpdateLastLoginAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<bool> IncrementFailedLoginAttemptsAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<bool> ResetFailedLoginAttemptsAsync(Guid userId, CancellationToken cancellationToken = default);
        #endregion
    }
}
