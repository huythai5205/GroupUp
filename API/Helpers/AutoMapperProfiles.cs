using System;
using System.Linq;
using API.DTOs;
using API.Models;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, UserDto>()
                .ForMember(dto => dto.EventsParticipating, opt => opt.MapFrom(appUser =>
                    appUser.EventsParticipating.ToDictionary(userEvent => userEvent.Event.Id, userEvent => userEvent.Event)))
                .ForMember(dto => dto.EventsCreated, opt => opt.MapFrom(appUser =>
                    appUser.EventsCreated.ToDictionary(@event => @event.Id, @event => @event)));
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Event, EventDto>()
                .ForMember(dto => dto.UsersParticipating, opt => opt.MapFrom(src =>
                    src.UsersParticipating.Select(e => e.User)));
            CreateMap<Photo, PhotoDto>();
            CreateMap<EventMessage, EventMessageDto>();
            CreateMap<MemberMessage, MemberMessageDto>()
                .ForMember(dto => dto.SenderPhotoUrl, opt => opt.MapFrom(src =>
                    src.Sender.ProfilePic.Url))
                .ForMember(dto => dto.RecipientPhotoUrl, opt => opt.MapFrom(src =>
                    src.Recipient.ProfilePic.Url));
            CreateMap<AppUser, MemberDto>()
                .ForMember(dto => dto.ProfilePic, opt => opt.MapFrom(a => a.ProfilePic.Url));
            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        }

    }
}