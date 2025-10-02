using AutoMapper;
using Wayfinder.DataLayer.Entity;

namespace Wayfinder.UserService.Api.MapperProfile
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<UserEntity, User.V1.User>();
            CreateMap<User.V1.CreateUser, UserEntity>();
            CreateMap<User.V1.UpdateUser, UserEntity>();
        }
    }
}
