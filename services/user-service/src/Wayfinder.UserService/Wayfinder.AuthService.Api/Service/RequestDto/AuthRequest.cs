namespace Wayfinder.AuthService.Api.Service.RequestDto
{
    public record AuthRequest
    {
        public string Password { get; init; } = default!;
        public Guid UserId { get; init; } = default!;
    }
}
