using Authuser.V1;
using Google.Protobuf.WellKnownTypes;
using Google.Type;
using Grpc.Core;
using Wayfinder.AuthService.Api.Constants;
using Wayfinder.AuthService.Api.Services.Interface;
using Wayfinder.AuthService.Api.Services.RequestDto;

namespace Wayfinder.AuthService.Api.gRPC
{
    public class AuthUserApi : Authuser.V1.AuthUserService.AuthUserServiceBase
    {
        private readonly IAuthService _authService;

        public AuthUserApi(IAuthService authService)
        {
            _authService = authService;
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
            catch (Exception)
            {

                throw;
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
            catch (Exception)
            {

                throw;
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
            catch (Exception)
            {
                throw;
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
            catch (Exception)
            {
                throw;
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
            catch (Exception)
            {
                throw;
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
            catch (Exception)
            {
                throw;
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
            catch (Exception)
            {
                throw;
            }
        }
        public override Task<ValidatePasswordStrengthResponse> ValidatePasswordStrength(ValidatePasswordStrengthRequest request, ServerCallContext context)
        {
            try
            {
                return Task.FromResult(new ValidatePasswordStrengthResponse
                {
                    IsStrong = _authService.ValidatePasswordStrength(request.RawPassword)
                });
            }
            catch (Exception)
            {
                throw;
            }
        } 
    }
}
