using Wayfinder.AuthService.Api.Services.RequestDto;
using Wayfinder.AuthService.Api.Services.ResponseDto;

namespace Wayfinder.AuthService.Api.Services.Interface
{
    public interface IAuthService
    {
        /// <summary>
        /// Validates the strength of a given password based on predefined security criteria.
        /// </summary>
        /// <param name="password"></param>
        /// <returns>Returns true if the password is strong</returns>
        PasswordValidationResult ValidatePasswordStrength(string password);
        /// <summary>
        /// Generates a secure hash and salt for the provided raw password.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns TokenResult containing RefreshToken, AccessToken, ExpiresAt</returns>
        Task<bool> RegisterAsync(AuthRequest request, CancellationToken cancellationToken = default);
        /// <summary>
        /// Handles user authentication by validating credentials and issuing tokens upon successful login.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<TokenResult> LoginAsync(AuthRequest request, CancellationToken cancellationToken = default);
        /// <summary>
        /// Changes the password for an authenticated user after validating the current password and 
        /// ensuring the new password meets security requirements.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns true if the password was changed successfully</returns>
        Task<bool> ChangePasswordAsync(ChangePasswordRequest request, CancellationToken cancellationToken = default);
        /// <summary>
        /// Validates the provided JWT token to ensure it is well-formed, not expired, and 
        /// was issued by a trusted authority.
        /// </summary>
        /// <param name="token"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns true if the token is valid</returns>
        bool ValidateToken(string accessToken);
        /// <summary>
        /// Refreshes the access token using a valid refresh token, issuing a new access token and 
        /// potentially a new refresh token.
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns TokenResult containing new RefreshToken, AccessToken, ExpiresAt</returns>
        Task<TokenResult> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
        /// <summary>
        /// Revokes the specified refresh token, rendering it invalid for future use.
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns true if the token was successfully revoked</returns>
        Task<bool> RevokeTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
        /// <summary>
        /// Revokes all refresh tokens associated with the specified user, 
        /// effectively logging them out from all sessions.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns true if all tokens were successfully revoked</returns>
        Task<int> LogOutFromEverywhereAsync(Guid userId, CancellationToken cancellationToken = default);
    }
}
