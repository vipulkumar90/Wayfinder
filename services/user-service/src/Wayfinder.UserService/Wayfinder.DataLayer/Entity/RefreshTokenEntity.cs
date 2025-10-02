using System.ComponentModel.DataAnnotations.Schema;

namespace Wayfinder.DataLayer.Entity
{
    [Table("RefreshTokens")]
    public class RefreshTokenEntity
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public UserEntity User { get; set; } = default!;
        public string Token { get; set; } = default!;
        public DateTime ExpiresAt { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
