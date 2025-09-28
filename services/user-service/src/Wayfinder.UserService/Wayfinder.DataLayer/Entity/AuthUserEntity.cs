using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wayfinder.DataLayer.Entity
{
    [Table("AuthUsers")]
    public class AuthUserEntity
    {
        /// <summary>
        /// Gets or sets the unique identifier for the entity.
        /// </summary>
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        /// <summary>
        /// Gets or sets the hashed representation of the user's password.
        /// </summary>
        /// <remarks>The password hash is typically generated using a secure cryptographic algorithm and
        /// should not be used to retrieve the original password. The value must not exceed 255 characters.</remarks>
        [Required, MaxLength(255)]
        public string PasswordHash { get; set; } = default!;
        /// <summary>
        /// Gets or sets the cryptographic salt used for password hashing.
        /// </summary>
        /// <remarks>The password salt should be a securely generated, random value unique to each user to
        /// enhance password security. Changing this value will affect password verification and may invalidate existing
        /// password hashes.</remarks>
        [Required]
        public string PasswordSalt { get; set; } = default!;
        /// <summary>
        /// Gets or sets the timestamp of the user's last successful login.
        /// </summary>
        public DateTime LastLoginAt { get; set; }
        /// <summary>
        /// Gets or sets a value indicating whether the user is required to change their password upon next login.
        /// </summary>
        public bool MustChangePassword { get; set; }
        /// <summary>
        /// Gets or sets the number of consecutive failed login attempts.
        /// </summary>
        public int FailedLoginAttempts { get; set; }
        /// <summary>
        /// Gets or sets the timestamp until which the user account is locked out.
        /// </summary>
        public DateTime? LockoutEnd { get; set; }
    }
}
