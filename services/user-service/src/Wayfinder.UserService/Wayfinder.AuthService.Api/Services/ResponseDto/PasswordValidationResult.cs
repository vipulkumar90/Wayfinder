namespace Wayfinder.AuthService.Api.Services.ResponseDto
{
    public class PasswordValidationResult
    {
        public bool IsStrong { get; set; }
        public List<string> Issues { get; set; } = new();
    }
}
