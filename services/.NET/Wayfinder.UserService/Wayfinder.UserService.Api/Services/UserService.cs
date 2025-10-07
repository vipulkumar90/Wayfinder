using System.Text.RegularExpressions;
using Wayfinder.DataLayer.Entity;
using Wayfinder.DataLayer.Repository.Interface;
using Wayfinder.UserService.Api.Constant;
using Wayfinder.UserService.Api.Services.Interface;

namespace Wayfinder.UserService.Api.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        /// <inheritdoc/>
        public async Task<UserEntity> AddUserAsync(UserEntity user, CancellationToken cancellationToken = default)
        {
            try
            {
                await ValidateUserAsync(user, isAddOperation: true, cancellationToken);
                user.IsActive = true;
                return await _userRepository.AddUserAsync(user, cancellationToken);
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<bool> DeleteUserAsync(Guid id, bool isHardDelete = false, CancellationToken cancellationToken = default)
        {
            try
            {
                if (id == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(id), "User ID cannot be empty");
                }
                if (isHardDelete)
                {
                    return await _userRepository.HardDeleteUserAsync(id, cancellationToken);
                }
                else
                {
                    return await _userRepository.SoftDeleteUserAsync(id, cancellationToken);
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<UserEntity>> GetAllUsersAsync(bool activeUsersOnly, CancellationToken cancellationToken = default)
        {
            try
            {
                if (activeUsersOnly)
                {
                    return await _userRepository.GetAllActiveUsersAsync(cancellationToken);
                }
                return await _userRepository.GetAllUsersAsync(cancellationToken);
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<UserEntity?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default)
        {
            try
            {
                email = ValidateEmail(email);
                var user = await _userRepository.GetUserAsync(u => u.Email == email && u.IsActive, cancellationToken);
                if (user is null)
                {
                    throw new Exception($"User having email:{email} not found");
                }
                return user;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<UserEntity?> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                if (id == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(id), "User ID cannot be empty");
                }
                var user = await _userRepository.GetUserAsync(u => u.Id == id && u.IsActive, cancellationToken);
                if (user is null)
                {
                    throw new Exception($"User having ID:{id} not found");
                }
                return user;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<UserEntity?> GetUserByUsernameAsync(string username, CancellationToken cancellationToken = default)
        {
            try
            {
                username = ValidateUsername(username);
                var user = await _userRepository.GetUserAsync(u => u.Username == username && u.IsActive, cancellationToken);
                if (user is null)
                {
                    throw new Exception($"User having username:{username} not found");
                }
                return user;
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
                // Validate User
                await ValidateUserAsync(user, cancellationToken: cancellationToken);
                var toBeUpdated = await GetUserByIdAsync(user.Id, cancellationToken);
                toBeUpdated!.Username = user.Username;
                toBeUpdated.Email = user.Email;
                toBeUpdated.FirstName = user.FirstName;
                toBeUpdated.LastName = user.LastName;
                toBeUpdated.PhoneNumber = user.PhoneNumber;
                return await _userRepository.UpdateUserAsync(toBeUpdated, cancellationToken);
            }
            catch (Exception)
            {

                throw;
            }
        }

        #region Private Methods
        private async Task ValidateUserAsync(UserEntity user, bool isAddOperation = false, CancellationToken cancellationToken = default)
        {
            /// Basic Validation
            if (user is null)
            {
                throw new ArgumentNullException(nameof(user), "User cannot be null");
            }
            // Username validation: Performs validation and removes leading/trailing whitespaces
            user.Username = ValidateUsername(user.Username);
            // Check if Username is unique if add operation
            if (isAddOperation)
                await CheckUniqueUsernameAsync(user.Username, cancellationToken);
            // Email validation: Performs validation and removes leading/trailing whitespaces
            user.Email = ValidateEmail(user.Email);
            // Check if Email is unique if add operation
            if (isAddOperation)
                await CheckUniqueEmailAsync(user.Email, cancellationToken);
            // First Name and Last Name validation
            user.FirstName = ValidateName(user.FirstName, UserConstant.FIRST_NAME_FIELDNAME)!;
            user.LastName = ValidateName(user.LastName, UserConstant.LAST_NAME_FIELDNAME, isLastName: true);
            user.PhoneNumber = ValidatePhoneNumber(user.PhoneNumber);
        }
        private string ValidateUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                throw new ArgumentNullException(nameof(username), "Username cannot be null");
            }
            if (username.Length > UserConstant.MAX_USERNAME_LENGTH)
            {
                throw new ArgumentOutOfRangeException(nameof(username), "Username cannot exceed 100 characters");
            }
            // Remove any leading or trailing whitespace
            username = username.Trim();
            // Check if Username contains spaces
            if (username.Contains(UserConstant.BLANK_SPACE))
            {
                throw new ArgumentException("Username cannot contain spaces", nameof(username));
            }
            return username;
        }

        private async Task CheckUniqueUsernameAsync(string username, CancellationToken cancellationToken)
        {
            var existingUserByUsername = await _userRepository.GetUserAsync(u => u.Username == username && u.IsActive, cancellationToken);
            if (existingUserByUsername is not null)
            {
                throw new ArgumentException("Username already exists", nameof(username));
            }
        }

        private string ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                throw new ArgumentNullException(nameof(email), "Email cannot be null");
            }
            if (email.Length > UserConstant.MAX_EMAIL_LENGTH)
            {
                throw new ArgumentOutOfRangeException(nameof(email), "Email cannot exceed 255 characters");
            }
            // Remove any leading or trailing whitespace
            email = email.Trim().ToLower();
            // Basic email format validation
            if (!Regex.IsMatch(email, UserConstant.REGEX_EMAIL))
            {
                throw new ArgumentException("Email format is invalid", nameof(email));
            }
            return email;
        }

        private async Task CheckUniqueEmailAsync(string email, CancellationToken cancellationToken = default)
        {
            var existingUserByEmail = await _userRepository.GetUserAsync(u => u.Email == email && u.IsActive, cancellationToken);
            if (existingUserByEmail is not null)
            {
                throw new ArgumentException("Email already exists", nameof(email));
            }
        }

        private string? ValidateName(string? name, string fieldName, bool isLastName = false)
        {
            if (isLastName && string.IsNullOrWhiteSpace(name))
            {
                return null; // Last name is optional
            }
            if (!isLastName && string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentNullException($"{fieldName} cannot be null"); // First name is required
            }
            if (name!.Length > UserConstant.MAX_NAME_LENGTH)
            {
                throw new ArgumentOutOfRangeException(nameof(name), $"{fieldName} cannot exceed 100 characters");
            }
            // Remove any leading or trailing whitespace
            name = name.Trim();
            if (name!.Contains(UserConstant.BLANK_SPACE))
            {
                throw new ArgumentException($"{fieldName} cannot contain spaces", nameof(name));
            }
            // Name cannot contains number or special characters
            if (name.Any(c => !char.IsLetter(c)))
            {
                throw new ArgumentException($"{fieldName} can only contain alphabetic characters", nameof(name));
            }
            return name; // returns trimmed field value
        }
        private string? ValidatePhoneNumber(string? phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
            {
                return null; // Phone number is optional
            }
            if (phoneNumber!.Length > UserConstant.MAX_PHONE_NUMBER_LENGTH)
            {
                throw new ArgumentOutOfRangeException(nameof(phoneNumber), "Phone number cannot exceed 15 characters");
            }
            // Remove any leading or trailing whitespace
            phoneNumber = phoneNumber.Trim();
            // Check if Phone number contains spaces
            if (phoneNumber.Contains(UserConstant.BLANK_SPACE))
            {
                throw new ArgumentException("Phone number cannot contain spaces", nameof(phoneNumber));
            }
            // Phone number can only contains digits and '+' at the start
            if (!Regex.IsMatch(phoneNumber, @"^\+?\d+$"))
            {
                throw new ArgumentException("Phone number can only contain digits and an optional leading '+'", nameof(phoneNumber));
            }
            return phoneNumber; // returns trimmed field value
        }
        #endregion
    }
}