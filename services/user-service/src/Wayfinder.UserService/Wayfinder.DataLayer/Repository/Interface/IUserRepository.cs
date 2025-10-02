using System.Linq.Expressions;
using Wayfinder.DataLayer.Entity;

namespace Wayfinder.DataLayer.Repository.Interface
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
        /// <param name="cancellationToken"></param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the matching <see
        /// cref="UserEntity"/> if found; otherwise, <see langword="null"/>.</returns>
        Task<UserEntity?> GetUserAsync(Expression<Func<UserEntity, bool>> predicate, CancellationToken cancellationToken = default);
        /// <summary>
        /// Asynchronously retrieves all user entities from the data store.
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns>A task that represents the asynchronous operation. The task result contains an enumerable collection of <see
        /// cref="UserEntity"/> objects representing all users. If no users exist, the collection will be empty.</returns>
        Task<IEnumerable<UserEntity>> GetAllUsersAsync(CancellationToken cancellationToken = default);
        /// <summary>
        /// Asynchronously retrieves all users that are currently marked as active.
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a collection of <see
        /// cref="UserEntity"/> objects representing all active users. If no users are active, the collection will be
        /// empty.</returns>
        Task<IEnumerable<UserEntity>> GetAllActiveUsersAsync(CancellationToken cancellationToken = default);
        /// <summary>
        /// Asynchronously adds a new user to the data store.
        /// </summary>
        /// <param name="user">The user entity to add. Cannot be null. The properties of the entity should be populated as required by the
        /// data store.</param>
        /// <param name="cancellationToken"></param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the added user entity, including
        /// any updated properties such as generated identifiers.</returns>
        Task<UserEntity> AddUserAsync(UserEntity user, CancellationToken cancellationToken = default);
        /// <summary>
        /// Asynchronously updates the specified user entity in the data store.
        /// </summary>
        /// <param name="user">The user entity containing updated information to be saved. Cannot be null. The entity must have a valid
        /// identifier.</param>
        /// <param name="cancellationToken"></param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the updated user entity if the
        /// update succeeds; otherwise, <see langword="null"/> if the user does not exist.</returns>
        Task<UserEntity?> UpdateUserAsync(UserEntity user, CancellationToken cancellationToken = default);
        /// <summary>
        /// Asynchronously deletes the user with the specified unique identifier by performing a soft delete.
        /// </summary>
        /// <param name="id">The unique identifier of the user to delete.</param>
        /// <param name="cancellationToken"></param>
        /// <returns>A task that represents the asynchronous operation. The task result is <see langword="true"/> if the user was
        /// successfully deleted; otherwise, <see langword="false"/>.</returns>
        Task<bool> SoftDeleteUserAsync(Guid id, CancellationToken cancellationToken = default);
        /// <summary>
        /// Asynchronously determines whether a user with the specified unique identifier exists.
        /// </summary>
        /// <param name="id">The unique identifier of the user to check for existence.</param>
        /// <param name="cancellationToken"></param>
        /// <returns>A task that represents the asynchronous operation. The task result is <see langword="true"/> if a user with
        /// the specified identifier exists; otherwise, <see langword="false"/>.</returns>
        Task<bool> UserExistsAsync(Guid id, CancellationToken cancellationToken = default);
        /// <summary>
        /// Deletes a user from the system by their unique identifier (hard delete).
        /// </summary>
        /// <param name="id"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns true if the user was successfully deleted; otherwise, returns false.</returns>
        Task<bool> HardDeleteUserAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
