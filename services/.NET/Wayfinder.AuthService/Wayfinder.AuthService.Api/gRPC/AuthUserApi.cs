using Authuser.V1;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Wayfinder.AuthService.Api.Constants;
using Wayfinder.AuthService.Api.Services.Interface;
using Wayfinder.AuthService.Api.Services.RequestDto;

namespace Wayfinder.AuthService.Api.gRPC
{
    public class AuthUserApi : AuthUserService.AuthUserServiceBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthUserApi> _logger;

        public AuthUserApi(IAuthService authService,
            ILogger<AuthUserApi> logger)
        {
            _authService = authService;
            _logger = logger;
        }
        public override async Task<RegisterUserResponse> RegisterUser(RegisterUserRequest request, ServerCallContext context)
        {
            try
            {
                return new RegisterUserResponse
                {
                    IsRegistered = await _authService.RegisterAsync(new AuthRequest
                    {
                        UserId = Guid.Parse(request.Credential.UserId),
                        RawPassword = request.Credential.RawPassword,
                        Roles = new List<string>
                        {
                            Roles.USER
                        }
                    }, context.CancellationToken)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return new RegisterUserResponse
                {
                    Error = new Common.Error
                    {
                        ErrorMessage = ex.Message,
                    }
                };
            }
        }
        public override async Task<LoginUserResponse> LoginUser(LoginUserRequest request, ServerCallContext context)
        {
            try
            {
                var loginResult = await _authService.LoginAsync(new AuthRequest
                {
                    UserId = Guid.Parse(request.Credential.UserId),
                    RawPassword = request.Credential.RawPassword,
                    Roles = new List<string> //TODO: We don't need to pass roles for Login
                    {
                        Roles.USER
                    }
                }, context.CancellationToken);
                // Call the login service
                return new LoginUserResponse
                {
                    Token = new Token
                    {
                        AccessToken = loginResult.AccessToken,
                        RefreshToken = loginResult.RefreshToken,
                        ExpiresAt = Timestamp.FromDateTime(loginResult.ExpiresAt.ToUniversalTime())
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return new LoginUserResponse
                {
                    Error = new Common.Error
                    {
                        ErrorMessage = ex.Message,
                    }
                };
            }
        }
        public override async Task<UpdatePasswordResponse> UpdatePassword(UpdatePasswordRequest request, ServerCallContext context)
        {
            try
            {
                return new UpdatePasswordResponse
                {
                    IsUpdated = await _authService.ChangePasswordAsync(new ChangePasswordRequest
                    {
                        UserId = Guid.Parse(request.UserId),
                        CurrentPassword = request.CurrentRawPassword,
                        NewPassword = request.NewRawPassword
                    }, context.CancellationToken)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return new UpdatePasswordResponse
                {
                    Error = new Common.Error
                    {
                        ErrorMessage = ex.Message,
                    }
                };
            }
        }
        public override Task<ValidateTokenResponse> ValidateToken(ValidateTokenRequest request, ServerCallContext context)
        {
            try
            {
                return Task.FromResult(new ValidateTokenResponse
                {
                    IsValid = _authService.ValidateToken(request.AccessToken)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Task.FromResult(new ValidateTokenResponse
                {
                    Error = new Common.Error
                    {
                        ErrorMessage = ex.Message,
                    }
                });
            }
        }
        public override async Task<RefreshTokenResponse> RefreshToken(RefreshTokenRequest request, ServerCallContext context)
        {
            try
            {
                var refreshResult = await _authService.RefreshTokenAsync(request.RefreshToken, context.CancellationToken);
                return new RefreshTokenResponse
                {
                    Token = new Token
                    {
                        AccessToken = refreshResult.AccessToken,
                        RefreshToken = refreshResult.RefreshToken,
                        ExpiresAt = Timestamp.FromDateTime(refreshResult.ExpiresAt.ToUniversalTime())
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return new RefreshTokenResponse
                {
                    Error = new Common.Error
                    {
                        ErrorMessage = ex.Message,
                    }
                };
            }
        }
        public override async Task<RevokeTokenResponse> RevokeToken(RevokeTokenRequest request, ServerCallContext context)
        {
            try
            {
                return new RevokeTokenResponse
                {
                    IsRevoked = await _authService.RevokeTokenAsync(request.RefreshToken, context.CancellationToken)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return new RevokeTokenResponse
                {
                    Error = new Common.Error
                    {
                        ErrorMessage = ex.Message,
                    }
                };
            }
        }
        public override async Task<RevokeAllTokenForUserResponse> RevokeAllTokenForUser(RevokeAllTokenForUserRequest request, ServerCallContext context)
        {
            try
            {
                return new RevokeAllTokenForUserResponse
                {
                    RevokedCount = await _authService.LogOutFromEverywhereAsync(
                        Guid.Parse(request.UserId), context.CancellationToken)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return new RevokeAllTokenForUserResponse
                {
                    Error = new Common.Error
                    {
                        ErrorMessage = ex.Message,
                    }
                };
            }
        }
        public override Task<ValidatePasswordStrengthResponse> ValidatePasswordStrength(ValidatePasswordStrengthRequest request, ServerCallContext context)
        {
            try
            {
                var result = _authService.ValidatePasswordStrength(request.RawPassword);
                var response = new ValidatePasswordStrengthResponse
                {
                    PasswordValidation = new PasswordValidation
                    {
                        IsStrong = result.IsStrong,
                    }
                };
                response.PasswordValidation.Issue.AddRange(result.Issues);
                return Task.FromResult(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Task.FromResult(new ValidatePasswordStrengthResponse
                {
                    Error = new Common.Error
                    {
                        ErrorMessage = ex.Message,
                    }
                });
            }
        } 
    }
}
