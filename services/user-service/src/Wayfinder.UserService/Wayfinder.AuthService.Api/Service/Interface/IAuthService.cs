using Wayfinder.AuthService.Api.Service.RequestDto;
using Wayfinder.AuthService.Api.Service.ResponseDto;

namespace Wayfinder.AuthService.Api.Services.Interface
{
    public interface IAuthService
    {
        /// <summary>
        /// Validates the strength of a given password based on predefined security criteria.
        /// </summary>
        /// <param name="password"></param>
        /// <returns>Returns true if the password is strong</returns>
        Task<bool> ValidatePasswordStrength(string password);
        /// <summary>
        /// Generates a secure hash and salt for the provided raw password.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns TokenResult containing RefreshToken, AccessToken, ExpiresAt</returns>
        Task<TokenResult> SignUpAsync(AuthRequest request, CancellationToken cancellationToken = default);
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
        Task<bool> ValidateTokenAsync(string token, CancellationToken cancellationToken = default);
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
        /// Logs out the user by invalidating the provided access token and associated session data.
        /// </summary>
        /// <param name="accessToken"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns true if the user was successfully logged</returns>
        Task<bool> LogOutAsync(string accessToken, CancellationToken cancellationToken = default);
    }
}
