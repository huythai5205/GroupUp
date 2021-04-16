using System.Threading.Tasks;
using API.DTOs;
using API.Helpers;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Interfaces
{
    public interface IEventRepository
    {
        Task<Event> GetEventByIdAsync(string eventId);
        Task<PagedList<EventDto>> GetEventsAsync(EventParams eventParams);
        Task<UserDto[]> GetParticipantsAsync(string eventId);
        Task<string[]> GetStatesAsync();
        Task<string[]> GetCitiesAsync(string state);
        Task<ActionResult<Event>> SaveEventAsync(Event @event);
    }
}