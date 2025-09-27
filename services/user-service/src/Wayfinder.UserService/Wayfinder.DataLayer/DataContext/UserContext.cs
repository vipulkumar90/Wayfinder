using Microsoft.EntityFrameworkCore;
using Wayfinder.DataLayer.Entity;

namespace Wayfinder.DataLayer.DataContext
{
    /// <summary>
    /// Represents the Entity Framework database context for user-related data, providing access to user entities and
    /// managing persistence operations.
    /// </summary>
    /// <remarks>This context is typically used to query, add, update, or remove user records in the
    /// underlying database. It automatically updates timestamp fields on user entities when changes are saved. The
    /// context should be configured with appropriate database provider and connection options when
    /// instantiated.</remarks>
    public class UserContext : DbContext
    {
        /// <summary>
        /// Initializes a new instance of the UserContext class using the specified database context options.
        /// </summary>
        /// <param name="options">The options to be used by the DbContext, including configuration such as the database provider and
        /// connection string. Cannot be null.</param>
        public UserContext(DbContextOptions<UserContext> options) 
            : base(options) { }
        /// <summary>
        /// Gets or sets the collection of user entities in the database context.
        /// </summary>
        public DbSet<UserEntity> Users { get; set; }
        /// <summary>
        /// Saves all changes made in this context to the underlying database and updates entity timestamps before
        /// saving.
        /// </summary>
        /// <remarks>This method automatically updates timestamp properties on tracked entities prior to
        /// saving changes. If an error occurs during the save operation, no changes are written to the
        /// database.</remarks>
        /// <returns>The number of state entries written to the database.</returns>
        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }
        /// <summary>
        /// Asynchronously saves all changes made in this context to the underlying database.
        /// </summary>
        /// <remarks>Before saving changes, this method updates timestamp properties on tracked entities
        /// as appropriate. This method is thread-safe and can be called concurrently from multiple threads.</remarks>
        /// <param name="cancellationToken">A cancellation token that can be used to cancel the asynchronous save operation.</param>
        /// <returns>A task that represents the asynchronous save operation. The task result contains the number of state entries
        /// written to the database.</returns>
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }
        /// <summary>
        /// Updates the creation and modification timestamps for tracked UserEntity instances that have been added or
        /// modified.
        /// </summary>
        /// <remarks>For entities in the Added state, both CreatedAt and UpdatedAt are set to the current
        /// UTC time. For entities in the Modified state, only UpdatedAt is updated. This method should be called before
        /// saving changes to ensure timestamp properties reflect the latest state.</remarks>
        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is UserEntity && 
                            (e.State == EntityState.Added || e.State == EntityState.Modified));
            foreach (var entry in entries)
            {
                var entity = (UserEntity)entry.Entity;
                if (entry.State == EntityState.Added)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                }
                entity.UpdatedAt = DateTime.UtcNow;
            }
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Make Username unique
            modelBuilder.Entity<UserEntity>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // Make Email unique
            modelBuilder.Entity<UserEntity>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Make Phonenumber unique if not null
            modelBuilder.Entity<UserEntity>()
                .HasIndex(u => u.PhoneNumber)
                .IsUnique()
                .HasFilter("[PhoneNumber] IS NOT NULL");
            base.OnModelCreating(modelBuilder);

            // Seed data
            var seedDate = new DateTime(2025, 09, 27, 0, 0, 0, DateTimeKind.Utc);

            modelBuilder.Entity<UserEntity>().HasData(
                new UserEntity
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Username = "itadori",
                    Email = "itadori.yuji@jjk.com",
                    FirstName = "Yuji",
                    LastName = "Itadori",
                    PhoneNumber = "1000000001",
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate,
                    IsActive = true
                },
                new UserEntity
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Username = "fushiguro",
                    Email = "megumi.fushiguro@jjk.com",
                    FirstName = "Megumi",
                    LastName = "Fushiguro",
                    PhoneNumber = "1000000002",
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate,
                    IsActive = true
                },
                new UserEntity
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    Username = "kugisaki",
                    Email = "nobara.kugisaki@jjk.com",
                    FirstName = "Nobara",
                    LastName = "Kugisaki",
                    PhoneNumber = "1000000003",
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate,
                    IsActive = false
                },
                new UserEntity
                {
                    Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    Username = "gojo",
                    Email = "satoru.gojo@jjk.com",
                    FirstName = "Satoru",
                    LastName = "Gojo",
                    PhoneNumber = "1000000004",
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate,
                    IsActive = true
                },
                new UserEntity
                {
                    Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                    Username = "nanami",
                    Email = "kento.nanami@jjk.com",
                    FirstName = "Kento",
                    LastName = "Nanami",
                    PhoneNumber = "1000000005",
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate,
                    IsActive = false
                }
            );
        }
    }
}
