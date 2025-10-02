namespace Wayfinder.AuthService.Api.Services.ResponseDto
{
    public record ValidatePasswordResponse
    {
        public string PasswordHash { get; set; } = default!;
        public string PasswordSalt { get; set; } = default!;
    }
}
