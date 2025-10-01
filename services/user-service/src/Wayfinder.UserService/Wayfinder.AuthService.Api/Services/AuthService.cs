using Microsoft.IdentityModel.Tokens;
using System.Data.SqlTypes;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Cryptography;
using System.Text;
using Wayfinder.AuthService.Api.Constants;
using Wayfinder.AuthService.Api.Services.Interface;
using Wayfinder.AuthService.Api.Services.RequestDto;
using Wayfinder.AuthService.Api.Services.ResponseDto;
using Wayfinder.DataLayer.Entity;
using Wayfinder.DataLayer.Repository.Interface;
using static Grpc.Core.Metadata;

namespace Wayfinder.AuthService.Api.Services
{
    public class AuthService : IAuthService
    {
        private const int KEY_SIZE = 32; // 256 bits
        private const int ITERATIONS = 100_000; // Number of iterations for PBKDF2
        private const int MIN_PASSWORD_LENGTH = 8; // Minimum password length requirement
        private readonly IAuthUserRepository _authUserRepository;
        private readonly IConfiguration _configuration;
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public AuthService(IAuthUserRepository authUserRepository, 
            IConfiguration configuration,
            IRefreshTokenRepository refreshTokenRepository)
        {
            _authUserRepository = authUserRepository;
            _configuration = configuration;
            _refreshTokenRepository = refreshTokenRepository;
        }

        /// <inheritdoc/>
        public async Task<bool> ChangePasswordAsync(ChangePasswordRequest request, CancellationToken cancellationToken = default)
        {
            try
            {
                // Fetch user by UserId
                var entity = await _authUserRepository.GetByUserIdAsync(request.UserId, cancellationToken);
                if (entity is null)
                {
                    throw new ArgumentException("User not found.");
                }
                // 1. Validate current password
                var isValid = VerifyPassword(request.CurrentPassword, entity.PasswordHash, entity.PasswordSalt);
                if (!isValid)
                {
                    throw new ArgumentException("Current password is incorrect.");
                }
                // 2. Validate new password strength
                var isStrong = ValidatePasswordStrength(request.NewPassword);
                if (!isStrong)
                {
                    throw new ArgumentException("New password does not meet strength requirements.");
                }
                // 3. Hash new password and update in database
                var saltBytes = RandomNumberGenerator.GetBytes(KEY_SIZE);
                entity.PasswordSalt = Convert.ToBase64String(saltBytes);
                entity.PasswordHash = Convert.ToBase64String(GeneratePasswordHash(request.NewPassword, saltBytes));
                entity.MustChangePassword = false; // Reset flag if it was set
                return await _authUserRepository.UpdatePasswordAsync(entity, cancellationToken);
            }
            catch (Exception)
            {

                throw;
            }
        }

        ///<inheritdoc/>
        public async Task<TokenResult> LoginAsync(AuthRequest request, CancellationToken cancellationToken = default)
        {
            try
            {
                /// Validate the user credentials are correct
                // 1. Fetch PasswordHash and PasswordSalt from database using request.UserId
                var entity = await _authUserRepository.GetByUserIdAsync(request.UserId, cancellationToken);
                if (entity is null)
                {
                    throw new ArgumentException("Invalid UserId or password.");
                }
                var validatePasswordResponse = new ValidatePasswordResponse
                {
                    PasswordHash = entity.PasswordHash,
                    PasswordSalt = entity.PasswordSalt
                };
                // 2. Hash the provided password with the stored salt and compare with stored hash
                var isValid = VerifyPassword(request.RawPassword, validatePasswordResponse.PasswordHash, validatePasswordResponse.PasswordSalt);
                if (!isValid)
                {
                    throw new ArgumentException("Wrong UserId or password.");
                }
                // 3. If valid, generate JWT tokens (AccessToken, RefreshToken) and return
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, request.UserId.ToString())
                };
                claims.AddRange(entity.Roles.Select(role => new Claim(ClaimTypes.Role, role)));
                var tokenResult = new TokenResult
                {
                    AccessToken = GenerateAccessToken(claims),
                    RefreshToken = GenerateRefreshToken(),
                    ExpiresAt = DateTime.UtcNow.AddMinutes(30) // Access token expiry time
                };
                // Store the refresh token in the database with an expiry date
                var refreshTokenEntity = new RefreshTokenEntity
                {
                    UserId = request.UserId,
                    Token = tokenResult.RefreshToken,
                    ExpiresAt = DateTime.UtcNow.AddDays(7), // Refresh token valid for 7 days
                    IsRevoked = false,
                    CreatedAt = DateTime.UtcNow
                };
                var createdEntity = await _refreshTokenRepository.CreateAsync(refreshTokenEntity, cancellationToken);
                if (createdEntity is null)
                {
                    throw new Exception("Failed to store refresh token.");
                }
                return tokenResult;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<int> LogOutFromEverywhereAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            try
            {
                // In Stateful refresh token implementation, we would remove all tokens for the user from the database
                if (userId == Guid.Empty)
                {
                    throw new ArgumentException("UserId must be a valid non-empty GUID.", nameof(userId));
                }
                var revokedCount =  await _refreshTokenRepository.RevokeAllTokensForUserAsync(userId, cancellationToken);
                if (revokedCount == 0)
                {
                    throw new Exception("No tokens were revoked. User may not have any active sessions.");
                }
                return revokedCount;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<TokenResult> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
        {
            try
            {
                // In Stateful refresh token implementation, we would validate the token from the database
                if (string.IsNullOrWhiteSpace(refreshToken))
                {
                    throw new ArgumentException("Refresh token must be provided.", nameof(refreshToken));
                }
                var refreshTokenEntity = await _refreshTokenRepository.GetByTokenAsync(refreshToken, cancellationToken);
                if (refreshTokenEntity is null || 
                    refreshTokenEntity.ExpiresAt <= DateTime.UtcNow || 
                    refreshTokenEntity.IsRevoked)
                {
                    throw new ArgumentException("Invalid or expired refresh token.");
                }
                // Generate new access token if the refresh token is valid
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, refreshTokenEntity.UserId.ToString())
                };
                var authUser = await _authUserRepository.GetByUserIdAsync(refreshTokenEntity.UserId, cancellationToken);
                if (authUser is null)
                {
                    throw new ArgumentException("User associated with the refresh token not found.");
                }
                claims.AddRange(authUser.Roles.Select(role => new Claim(ClaimTypes.Role, role)));
                var tokenResult = new TokenResult
                {
                    AccessToken = GenerateAccessToken(claims),
                    RefreshToken = refreshTokenEntity.Token,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(30) // Access token expiry time
                };
                return tokenResult;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public Task<bool> RevokeTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
        {
            try
            {
                // In Stateful refresh token implementation, we 
                // would remove the token from the database or mark it as revoked.
                if (string.IsNullOrWhiteSpace(refreshToken))
                {
                    throw new ArgumentException("Refresh token must be provided.", nameof(refreshToken));
                }
                return _refreshTokenRepository.RevokeTokenAsync(refreshToken, cancellationToken);
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<bool> RegisterAsync(AuthRequest request, CancellationToken cancellationToken = default)
        {
            try
            {
                if (request.UserId == Guid.Empty)
                {
                    throw new ArgumentException("UserId must be a valid non-empty GUID.", nameof(request.UserId));
                }
                if (string.IsNullOrWhiteSpace(request.RawPassword))
                {
                    throw new ArgumentException("RawPassword cannot be null or empty.", nameof(request.RawPassword));
                }
                var entity = new AuthUserEntity
                {
                    UserId = request.UserId,
                    FailedLoginAttempts = 0,
                    LockoutEnd = null,
                    LastLoginAt = null,
                    MustChangePassword = false,
                    // Roles can be set based on application logic, e.g., default to "User"
                    Roles = request.Roles 
                };
                // Using PBKDF2 for hashing
                var saltBytes = RandomNumberGenerator.GetBytes(KEY_SIZE);
                entity.PasswordSalt = Convert.ToBase64String(saltBytes);
                entity.PasswordHash = Convert.ToBase64String(GeneratePasswordHash(request.RawPassword, saltBytes));
                return await _authUserRepository.AddAsync(entity, cancellationToken);
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public bool ValidatePasswordStrength(string password)
        {
            try
            {
                // Check for minimum length
                if (string.IsNullOrWhiteSpace(password) || password.Length < MIN_PASSWORD_LENGTH)
                    return false;
                // Check for at least one uppercase letter
                if (!password.Any(char.IsUpper))
                    return false;
                // Check for at least one lowercase letter
                if (!password.Any(char.IsLower))
                    return false;
                // Check for at least one digit
                if (!password.Any(char.IsDigit))
                    return false;
                // Check for at least one special character
                if (!password.Any(ch => !char.IsLetterOrDigit(ch)))
                    return false;
                return true;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <inheritdoc/>
        public bool ValidateToken(string accessToken)
        {
            try
            {
                // Validate the JWT token
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["JWT:Secret"] ?? 
                    throw new ArgumentNullException("JWT:Secret configuration value is missing."));
                var validationParameters = new TokenValidationParameters
                    {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _configuration["JWT:ValidIssuer"],
                    ValidAudience = _configuration["JWT:ValidAudience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero // Optional: reduce clock skew tolerance
                };
                tokenHandler.ValidateToken(accessToken, validationParameters, out SecurityToken validatedToken);
                return true;
            }
            catch (Exception)
            {

                throw;
            }
        }
        #region Private Methods
        private byte[] GeneratePasswordHash(string rawPassword, byte[] saltBytes)
        {
            return Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(rawPassword),
                saltBytes,
                ITERATIONS,
                HashAlgorithmName.SHA512,
                KEY_SIZE);
        }
        private string GenerateAccessToken(IEnumerable<Claim> claims = default!)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            // Create a symmetric security key using the secret key from the configuration
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["JWT:Secret"] ?? 
                throw new ArgumentNullException("JWT:Secret configuration value is missing.")));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _configuration["JWT:ValidIssuer"],
                Audience = _configuration["JWT:ValidAudience"],
                Expires = DateTime.UtcNow.AddMinutes(30), // Access token valid for 30 minutes
                SigningCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256),
                Subject = new ClaimsIdentity(claims ??
                [
                    new Claim(ClaimTypes.Role, "User") // Default role
                ])
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        private string GenerateRefreshToken()
        {
            // Createa a 64-byte array to hold cryptographically secure random bytes
            var randomNumber = new byte[64];
            // Use a cryptographically secure random number generator
            // to fill the array with random bytes
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            // Convert the byte array to a Base64 string and return it
            return Convert.ToBase64String(randomNumber);
        }
        private bool VerifyPassword(string rawPassword, string storedHash, string storedSalt)
        {
            var saltBytes = Convert.FromBase64String(storedSalt);
            var hashBytes = Convert.FromBase64String(storedHash);
            var computedHash = GeneratePasswordHash(rawPassword, saltBytes);
            return CryptographicOperations.FixedTimeEquals(computedHash, hashBytes);
        }
        #endregion
    }
}
