using AutoMapper;
using Grpc.Core;
using UserPb.V1;
using Wayfinder.DataLayer.Entity;
using Common;
using Wayfinder.UserService.Api.Services.Interface;

namespace Wayfinder.UserService.Api.gRPC
{
    public class UserApi : UserPb.V1.UserService.UserServiceBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly ILogger<UserApi> _logger;

        public UserApi(IUserService userService,
            IMapper mapper,
            ILogger<UserApi> logger)
        {
            _userService = userService;
            _mapper = mapper;
            _logger = logger;
        }

        public override async Task<CreateUserResponse> CreateUser(CreateUserRequest request, ServerCallContext context)
        {
            try
            {
                var createdUser = await _userService.AddUserAsync(_mapper.Map<UserEntity>(request.User));
                return new CreateUserResponse
                {
                    User = _mapper.Map<User>(createdUser)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return new CreateUserResponse
                {
                    Error = new Error
                    {
                        ErrorMessage = ex.Message,
                    }
                };
            }
        }

        public override async Task<GetAllUsersResponse> GetAllUsers(GetAllUsersRequest request, ServerCallContext context)
        {
            try
            {
                var users = await _userService.GetAllUsersAsync(cancellationToken: context.CancellationToken);
                return new GetAllUsersResponse
                {
                    Users = new UserList
                    {
                        Users = { _mapper.Map<List<User>>(users) }
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return new GetAllUsersResponse
                {
                    Error = new Error
                    {
                        ErrorMessage = ex.Message,
                    }
                };
            }
        }
        public override async Task<DeleteUserResponse> DeleteUser(DeleteUserRequest request, ServerCallContext context)
        {
            try
            {
                return new DeleteUserResponse
                {
                    Success = await _userService.DeleteUserAsync(Guid.Parse(request.Id), cancellationToken: context.CancellationToken)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return new DeleteUserResponse
                {
                    Error = new Error
                    {
                        ErrorMessage = ex.Message,
                    }
                };
            }
        }
        public override async Task<GetAllUsersResponse> GetAllActiveUsers(GetAllUsersRequest request, ServerCallContext context)
        {
            try
            {
                return new GetAllUsersResponse
                {
                    Users = new UserList
                    {
                        Users =
                        {
                            _mapper.Map<List<User>>(await _userService.GetAllUsersAsync(
                                activeUsersOnly:true,
                                cancellationToken:context.CancellationToken))
                        }
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return new GetAllUsersResponse
                {
                    Error = new Error
                    {
                        ErrorMessage = ex.Message
                    }
                };
            }
        }
        public override async Task<GetUserResponse> GetUserByEmail(GetUserByEmailRequest request, ServerCallContext context)
        {
            try
            {
                return new GetUserResponse
                {
                    User = _mapper.Map<User>(await _userService.GetUserByEmailAsync(
                        request.Email,
                        context.CancellationToken))
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return new GetUserResponse
                {
                    Error = new Error
                    {
                        ErrorMessage = ex.Message
                    }
                };
            }
        }
        public override async Task<GetUserResponse> GetUserById(GetUserByIdRequest request, ServerCallContext context)
        {
            try
            {
                return new GetUserResponse
                {
                    User = _mapper.Map<User>(await _userService.GetUserByIdAsync(
                        Guid.Parse(request.Id),
                        context.CancellationToken))
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return new GetUserResponse
                {
                    Error = new Error
                    {
                        ErrorMessage = ex.Message
                    }
                };
            }
        }
        public override async Task<GetUserResponse> GetUserByUsername(GetUserByUsernameRequest request, ServerCallContext context)
        {
            try
            {
                return new GetUserResponse
                {
                    User = _mapper.Map<User>(await _userService.GetUserByUsernameAsync(
                        request.Username,
                        context.CancellationToken))
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return new GetUserResponse
                {
                    Error = new Error
                    {
                        ErrorMessage = ex.Message
                    }
                };
            }
        }
        public override async Task<UpdateUserResponse> UpdateUser(UpdateUserRequest request, ServerCallContext context)
        {
            try
            {
                return new UpdateUserResponse
                {
                    User = _mapper.Map<User>(await _userService.UpdateUserAsync(
                        _mapper.Map<UserEntity>(request.User),
                        context.CancellationToken))
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return new UpdateUserResponse
                {
                    Error = new Error
                    {
                        ErrorMessage = ex.Message
                    }
                };
            }
        }
    }
}