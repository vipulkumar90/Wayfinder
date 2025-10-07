namespace Wayfinder.AuthService.Api.Services.RequestDto
{
    public record AuthRequest
    {
        public string RawPassword { get; init; } = default!;
        public Guid UserId { get; init; } = default!;
        public IEnumerable<string> Roles { get; set; } = default!;
    }
}
