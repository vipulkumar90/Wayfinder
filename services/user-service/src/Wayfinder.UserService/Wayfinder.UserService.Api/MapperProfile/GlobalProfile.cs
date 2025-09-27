using AutoMapper;
using Google.Protobuf.WellKnownTypes;

namespace Wayfinder.UserService.Api.MapperProfile
{
    public class GlobalProfile : Profile
    {
        public GlobalProfile()
        {
            CreateMap<DateTime, Timestamp>()
                .ConvertUsing(src => Timestamp.FromDateTime(src.ToUniversalTime()));
            CreateMap<Timestamp, DateTime>()
                .ConvertUsing(src => src.ToDateTime());
        }
    }
}
