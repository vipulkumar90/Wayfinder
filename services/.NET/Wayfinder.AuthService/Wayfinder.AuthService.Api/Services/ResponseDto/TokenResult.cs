namespace Wayfinder.AuthService.Api.Services.ResponseDto
{
    public record TokenResult
    {
        public string AccessToken { get; init; } = default!;
        public string RefreshToken { get; init; } = default!;
        public DateTime ExpiresAt { get; init; }
    }
}
