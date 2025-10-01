namespace Wayfinder.AuthService.Api.Constants
{
    public static class PasswordValidationMessage
    {
        public static readonly string TOO_SHORT = "Password must be at least {0} characters long.";
        public const string NO_UPPERCASE = "Password must contain at least one uppercase letter.";
        public const string NO_LOWERCASE = "Password must contain at least one lowercase letter.";
        public const string NO_DIGIT = "Password must contain at least one digit.";
        public const string NO_SPECIAL_CHAR = "Password must contain at least one special character.";
    }
}
