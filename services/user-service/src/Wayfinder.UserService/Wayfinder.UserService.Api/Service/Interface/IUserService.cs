using Wayfinder.DataLayer.Entity;

namespace Wayfinder.UserService.Api.Service.Interface
{
    public interface IUserService
    {
        /// <summary>
        /// Adds a new user to the system.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns the created UserEntity with its assigned ID and other properties.</returns>
        Task<UserEntity> AddUserAsync(UserEntity user, CancellationToken cancellationToken = default);
        /// <summary>
        /// Updates an existing user in the system.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns the updated UserEntity if the update was successful; otherwise, returns null.</returns>
        Task<UserEntity?> UpdateUserAsync(UserEntity user, CancellationToken cancellationToken = default);
        /// <summary>
        /// Deletes a user from the system by their unique identifier (soft delete).
        /// </summary>
        /// <param name="id"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns true if the user was successfully deleted; otherwise, returns false.</returns>
        Task<bool> DeleteUserAsync(Guid id, bool isHardDelete = false, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets a user by their unique identifier.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns the UserEntity if found; otherwise, returns null.</returns>
        Task<UserEntity?> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets a user by their username.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns the UserEntity if found; otherwise, returns null.</returns>
        Task<UserEntity?> GetUserByUsernameAsync(string username, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets a user by their email address.
        /// </summary>
        /// <param name="email"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns the UserEntity if found; otherwise, returns null.</returns>
        Task<UserEntity?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets all users in the system.
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <param name="activeUsersOnly"></param>
        /// <returns>Returns an enumerable collection of UserEntity objects if any users exist; otherwise, returns null.</returns>
        Task<IEnumerable<UserEntity>> GetAllUsersAsync(bool activeUsersOnly = false, CancellationToken cancellationToken = default);
    }
}
