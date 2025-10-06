using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wayfinder.DataLayer.Entity
{
    /// <summary>
    /// Represents a user entity mapped to the "Users" database table, containing identifying and contact information,
    /// personal details, and metadata for user management.
    /// </summary>
    /// <remarks>This class is typically used in data access scenarios to persist and retrieve user
    /// information from the database. It includes properties for unique identification, authentication, and user
    /// profile data, as well as metadata for auditing and status tracking. Property constraints such as required fields
    /// and maximum lengths are enforced via data annotations, but additional validation may be necessary depending on
    /// application requirements.</remarks>
    [Table("Users")]
    public class UserEntity
    {
        /// <summary>
        /// Gets or sets the unique identifier for the entity.
        /// </summary>
        [Key]
        public Guid Id { get; set; }
        /// <summary>
        /// Gets or sets the username associated with the user account.
        /// </summary>
        /// <remarks>The username must be provided and cannot exceed 100 characters in length.</remarks>
        [Required, MaxLength(100)]
        public string Username { get; set; } = default!;
        /// <summary>
        /// Gets or sets the email address associated with the user.
        /// </summary>
        /// <remarks>The email address must not be null and cannot exceed 255 characters. This property is
        /// typically used for user identification and contact purposes.</remarks>
        [Required, MaxLength(255)]
        public string Email { get; set; } = default!;
        /// <summary>
        /// Gets or sets the first name of the person.
        /// </summary>
        /// <remarks>The first name is required and must not exceed 100 characters.</remarks>
        [Required, MaxLength(100)]
        public string FirstName { get; set; } = default!;
        /// <summary>
        /// Gets or sets the last name of the person.
        /// </summary>
        [MaxLength(100)]
        public string? LastName { get; set; }
        /// <summary>
        /// Gets or sets the phone number associated with the entity.
        /// </summary>
        /// <remarks>The phone number must not exceed 15 characters in length. The format and validation
        /// of the phone number are not enforced by this property.</remarks>
        [MaxLength(15)]
        public string? PhoneNumber { get; set; }
        // Metadata
        /// <summary>
        /// Gets or sets the date and time when the object was created.
        /// </summary>
        public DateTime CreatedAt { get; set; }
        /// <summary>
        /// Gets or sets the date and time when the entity was last updated.
        /// </summary>
        public DateTime UpdatedAt { get; set; }
        /// <summary>
        /// Gets or sets a value indicating whether the entity is currently active.
        /// </summary>
        public bool IsActive { get; set; }
    }
}
