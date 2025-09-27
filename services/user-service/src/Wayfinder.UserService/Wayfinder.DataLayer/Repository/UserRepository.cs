using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Wayfinder.DataLayer.DataContext;
using Wayfinder.DataLayer.Entity;

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
        public async Task<UserEntity> AddUserAsync(UserEntity user)
        {
            try
            {
                // Making the user active on creation
                user.IsActive = true; 
                _context.Add(user);
                await _context.SaveChangesAsync();
                return user;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<bool> DeleteUserAsync(Guid id)
        {
            try
            {
                // User to be deleted
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (user is not null && user.IsActive)
                {
                    user.IsActive = false;
                    await _context.SaveChangesAsync();
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
        public async Task<IEnumerable<UserEntity>> GetAllUsersAsync()
        {
            try
            {
                return await _context.Users.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<UserEntity?> GetUserAsync(Expression<Func<UserEntity, bool>> predicate)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(predicate);
                if (user is not null && user.IsActive)
                {
                    return user;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<UserEntity?> UpdateUserAsync(UserEntity user)
        {
            try
            {
                // Find the user to be updated
                var update = await _context.Users.FirstOrDefaultAsync(u => u.Id == user.Id);
                if (update is not null && update.IsActive)
                {
                    update.Username = user.Username;
                    update.Email = user.Email;
                    update.FirstName = user.FirstName;
                    update.PhoneNumber = user.PhoneNumber;
                    update.LastName = user.LastName;
                    _context.Update(update);
                    await _context.SaveChangesAsync();
                    return update;
                }
                return null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<bool> UserExistsAsync(Guid id)
        {
            try
            {
                return await _context.Users.AnyAsync(u => u.Id == id && u.IsActive);
            }
            catch (Exception)
            {

                throw;
            }
        }
        /// <inheritdoc/>
        public async Task<IEnumerable<UserEntity>> GetAllActiveUsersAsync()
        {
            try
            {
                return await _context.Users.Where(u => u.IsActive).ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
