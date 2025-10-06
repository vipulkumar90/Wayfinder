using Microsoft.EntityFrameworkCore;
using Wayfinder.DataLayer.Entity;

namespace Wayfinder.DataLayer.DataContext
{
    public class AuthUserContext : DbContext
    {
        public AuthUserContext(DbContextOptions<AuthUserContext> options)
            : base(options) { }
        public DbSet<AuthUserEntity> AuthUsers { get; set; }
        public DbSet<RefreshTokenEntity> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasAnnotation("Relational:HistoryTableName", "__AuthUserMigrationsHistory");
        }
    }
}
