using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Wayfinder.DataLayer.DataContext;
using Wayfinder.DataLayer.Entity;
using Wayfinder.DataLayer.Repository.Interface;

namespace Wayfinder.DataLayer.Repository
{
    /// <summary>
    /// Provides methods for managing and retrieving user entities in the data store.
    /// </summary>
    /// <remarks>The UserRepository class defines asynchronous operations for adding, updating, deleting, and
    /// querying users by various identifiers. It is typically used as a data access layer component in applications
    /// that require user management functionality. All methods are asynchronous and return Task-based results, allowing
    /// for non-blocking database operations. This class implements the IUserRepository interface, enabling dependency
    /// injection and abstraction of user data access logic.</remarks>
    public class UserRepository : IUserRepository
    {
        private readonly UserContext _context;

        public UserRepository(UserContext context)
        {
            _context = context;
        }
        /// <inheritdoc/>
        public async Task<UserEntity> AddUserAsync(UserEntity user, CancellationToken cancellationToken = default)
        {
            try
            {
                await _context.AddAsync(user, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);
                return user;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<bool> SoftDeleteUserAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                // User to be deleted
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (user is not null && user.IsActive)
                {
                    user.IsActive = false;
                    await _context.SaveChangesAsync(cancellationToken);
                    return true;
                }
                return false;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<UserEntity>> GetAllUsersAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                return await _context.Users.ToListAsync(cancellationToken);
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<UserEntity?> GetUserAsync(Expression<Func<UserEntity, bool>> predicate, CancellationToken cancellationToken = default)
        {
            try
            {
                return await _context.Users.FirstOrDefaultAsync(predicate, cancellationToken);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<UserEntity?> UpdateUserAsync(UserEntity user, CancellationToken cancellationToken = default)
        {
            try
            {
                // Update user
                _context.Update(user);
                await _context.SaveChangesAsync(cancellationToken);
                return user;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<bool> UserExistsAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                return await _context.Users.AnyAsync(u => u.Id == id && u.IsActive, cancellationToken);
            }
            catch (Exception)
            {

                throw;
            }
        }
        /// <inheritdoc/>
        public async Task<IEnumerable<UserEntity>> GetAllActiveUsersAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                return await _context.Users.Where(u => u.IsActive).ToListAsync(cancellationToken);
            }
            catch (Exception)
            {
                throw;
            }
        }
        /// <inheritdoc/>
        public async Task<bool> HardDeleteUserAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
                if (user is not null)
                {
                    _context.Users.Remove(user);
                    await _context.SaveChangesAsync(cancellationToken);
                    return true;
                }
                return false;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
