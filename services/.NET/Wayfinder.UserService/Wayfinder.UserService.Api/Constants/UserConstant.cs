namespace Wayfinder.UserService.Api.Constant
{
    public static class UserConstant
    {
        public const int MAX_USERNAME_LENGTH = 100;
        public const int MAX_EMAIL_LENGTH = 255;
        public const int MAX_NAME_LENGTH = 100;
        public const int MAX_PHONE_NUMBER_LENGTH = 15;
        public const string BLANK_SPACE = " ";
        public const string REGEX_EMAIL = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
        public const string FIRST_NAME_FIELDNAME = "FirstName";
        public const string LAST_NAME_FIELDNAME = "LastName";
    }
}