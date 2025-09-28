namespace Wayfinder.AuthService.Api.Service.ResponseDto
{
    public record TokenResult
    {
        public string AccessToken { get; init; } = default!;
        public string RefreshToken { get; init; } = default!;
        public DateTime ExpiresAt { get; init; }
    }
}
