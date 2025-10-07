namespace Wayfinder.AuthService.Api.Services.RequestDto
{
    public record ChangePasswordRequest
    {
        public Guid UserId { get; init; } = default!;
        public string CurrentPassword { get; init; } = default!;
        public string NewPassword { get; init; } = default!;
    }
}
