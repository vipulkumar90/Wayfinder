using AutoMapper;
using Grpc.Core;
using User.V1;
using Wayfinder.DataLayer.Entity;
using Wayfinder.DataLayer.Repository;

namespace Wayfinder.UserService.Api.gRPC
{
    public class UserApi : User.V1.UserService.UserServiceBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserApi(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public override async Task<CreateUserResponse> CreateUser(CreateUserRequest request, ServerCallContext context)
        {
            try
            {
                var createdUser = await _userRepository.AddUserAsync(_mapper.Map<UserEntity>(request.User));
                var test = _mapper.Map<User.V1.User>(createdUser);
                return new CreateUserResponse
                {
                    User = test
                };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public override async Task<GetAllUsersResponse> GetAllUsers(GetAllUsersRequest request, ServerCallContext context)
        {
            try
            {
                var users = await _userRepository.GetAllUsersAsync();
                return new GetAllUsersResponse
                {
                    Users = { _mapper.Map<IEnumerable<User.V1.User>>(users) }
                };
            }
            catch (Exception)
            {

                throw;
            }
        }
        public override async Task<DeleteUserResponse> DeleteUser(DeleteUserRequest request, ServerCallContext context)
        {
            try
            {
                return new DeleteUserResponse
                {
                    Success = await _userRepository.DeleteUserAsync(Guid.Parse(request.Id))
                };
            }
            catch (Exception)
            {

                throw;
            }
        }
        public override async Task<GetAllUsersResponse> GetAllActiveUsers(GetAllUsersRequest request, ServerCallContext context)
        {
            try
            {
                return new GetAllUsersResponse
                {
                    Users = { _mapper.Map<List<User.V1.User>>(await _userRepository.GetAllActiveUsersAsync()) }
                };
            }
            catch (Exception)
            {

                throw;
            }
        }
        public override async Task<GetUserResponse> GetUserByEmail(GetUserByEmailRequest request, ServerCallContext context)
        {
            try
            {
                return new GetUserResponse
                {
                    User = _mapper.Map<User.V1.User>(await _userRepository.GetUserAsync(u => u.Email == request.Email))
                };
            }
            catch (Exception)
            {

                throw;
            }
        }
        public override async Task<GetUserResponse> GetUserById(GetUserByIdRequest request, ServerCallContext context)
        {
            try
            {
                return new GetUserResponse
                {
                    User = _mapper.Map<User.V1.User>(await _userRepository.GetUserAsync(u => u.Id == Guid.Parse(request.Id)))
                };
            }
            catch (Exception)
            {

                throw;
            }
        }
        public override async Task<GetUserResponse> GetUserByUsername(GetUserByUsernameRequest request, ServerCallContext context)
        {
            try
            {
                return new GetUserResponse
                {
                    User = _mapper.Map<User.V1.User>(await _userRepository.GetUserAsync(u => u.Username == request.Username))
                };
            }
            catch (Exception)
            {

                throw;
            }
        }
        public override async Task<UpdateUserResponse> UpdateUser(UpdateUserRequest request, ServerCallContext context)
        {
            try
            {
                return new UpdateUserResponse
                {
                    User = _mapper.Map<User.V1.User>(await _userRepository.UpdateUserAsync(_mapper.Map<UserEntity>(request.User)))
                };
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
