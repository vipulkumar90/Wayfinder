using AutoMapper;
using Wayfinder.DataLayer.Entity;
using UserPb.V1;

namespace Wayfinder.UserService.Api.MapperProfile
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<UserEntity, User>();
            CreateMap<CreateUser, UserEntity>();
            CreateMap<UpdateUser, UserEntity>();
        }
    }
}
