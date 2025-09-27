using System.Linq.Expressions;
using Wayfinder.UserService.Api.Entity;

namespace Wayfinder.UserService.Api.Repository
{
    /// <summary>
    /// Defines a contract for managing user entities in a data store, including retrieval, creation, update, and
    /// deletion operations.
    /// </summary>
    /// <remarks>Implementations of this interface should ensure thread safety if accessed concurrently.
    /// Methods are asynchronous and may involve I/O operations such as database access. Returned user entities may be
    /// null if the specified user does not exist.</remarks>
    public interface IUserRepository
    {
        /// <summary>
        /// Asynchronously retrieves a user entity that matches the specified predicate.
        /// </summary>
        /// <param name="predicate">An expression used to filter user entities. The predicate defines the criteria that the returned user must
        /// satisfy. It can be Id, Email or Username</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the matching <see
        /// cref="UserEntity"/> if found; otherwise, <see langword="null"/>.</returns>
        Task<UserEntity?> GetUserAsync(Expression<Func<UserEntity, bool>> predicate);
        /// <summary>
        /// Asynchronously retrieves all user entities from the data store.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation. The task result contains an enumerable collection of <see
        /// cref="UserEntity"/> objects representing all users. If no users exist, the collection will be empty.</returns>
        Task<IEnumerable<UserEntity>> GetAllUsersAsync();
        /// <summary>
        /// Asynchronously retrieves all users that are currently marked as active.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation. The task result contains a collection of <see
        /// cref="UserEntity"/> objects representing all active users. If no users are active, the collection will be
        /// empty.</returns>
        Task<IEnumerable<UserEntity>> GetAllActiveUsersAsync();
        /// <summary>
        /// Asynchronously adds a new user to the data store.
        /// </summary>
        /// <param name="user">The user entity to add. Cannot be null. The properties of the entity should be populated as required by the
        /// data store.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the added user entity, including
        /// any updated properties such as generated identifiers.</returns>
        Task<UserEntity> AddUserAsync(UserEntity user);
        /// <summary>
        /// Asynchronously updates the specified user entity in the data store.
        /// </summary>
        /// <param name="user">The user entity containing updated information to be saved. Cannot be null. The entity must have a valid
        /// identifier.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the updated user entity if the
        /// update succeeds; otherwise, <see langword="null"/> if the user does not exist.</returns>
        Task<UserEntity?> UpdateUserAsync(UserEntity user);
        /// <summary>
        /// Asynchronously deletes the user with the specified unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the user to delete.</param>
        /// <returns>A task that represents the asynchronous operation. The task result is <see langword="true"/> if the user was
        /// successfully deleted; otherwise, <see langword="false"/>.</returns>
        Task<bool> DeleteUserAsync(Guid id);
        /// <summary>
        /// Asynchronously determines whether a user with the specified unique identifier exists.
        /// </summary>
        /// <param name="id">The unique identifier of the user to check for existence.</param>
        /// <returns>A task that represents the asynchronous operation. The task result is <see langword="true"/> if a user with
        /// the specified identifier exists; otherwise, <see langword="false"/>.</returns>
        Task<bool> UserExistsAsync(Guid id);
    }
}
