namespace Wayfinder.AuthService.Api.Services.RequestDto
{
    public record TokenRequest
    {
        public string RefreshToken { get; init; } = default!;
        public string AccessToken { get; init; } = default!;
    }
}
