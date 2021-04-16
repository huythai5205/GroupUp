using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Authorize]
    public class EventsController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public EventsController(
            IMapper mapper,
            IUnitOfWork unitOfWork
        )
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<PagedList<EventDto>> GetEventsAsync([FromQuery] EventParams eventParams)
        {

            var events = await _unitOfWork.EventRepository.GetEventsAsync(eventParams);

            Response.AddPaginationHeader(events.CurrentPage, events.PageSize, events.TotalCount, events.TotalPages);

            return events;
        }

        [HttpGet("{eventId}")]
        public async Task<ActionResult<EventDto>> GetEventAsync(string eventId)
        {
            var @event = await _unitOfWork.EventRepository.GetEventByIdAsync(eventId);

            var e = _mapper.Map<EventDto>(@event);

            return Ok(e);
        }

        [HttpGet("getParticipants/{eventId}")]
        public async Task<ActionResult> GetParticipantsAsync(string eventId)
        {
            return Ok(await _unitOfWork.EventRepository.GetParticipantsAsync(eventId));
        }

        [HttpGet("states")]
        public async Task<IActionResult> GetStatesAsync()
        {
            return Ok(await _unitOfWork.EventRepository.GetStatesAsync());
        }

        [HttpGet("cities/{state}")]
        public async Task<IActionResult> GetCitiesAsync(string state)
        {
            return Ok(await _unitOfWork.EventRepository.GetCitiesAsync(state));
        }


        // [Route("api/events/byDistance"), HttpGet]
        // public IActionResult ByDistanceAsync(double latitude, double longitude, double distance)
        // {

        //     var coord = new GeoCoordinate(latitude, longitude);

        //     var events = db.Events
        //          .Include(e => e.Creator)
        //         .Include(e => e.RepeatingDaysTimes)
        //         .Include(e => e.UsersParticipating)
        //         .Include(e => e.Location)
        //         .Select(e => new
        //         {
        //             e.Id,
        //             e.Name,
        //             e.NumParticipants,
        //             e.SpotsAvailable,
        //             e.IsRepeating,
        //             e.Description,
        //             e.Location,
        //             Coords = new GeoCoordinate(e.Location.Latitude, e.Location.Longitude),
        //             e.StartsDate,
        //             e.StartsTime,
        //             e.EndsTime,
        //             e.RepeatingDaysTimes,
        //             e.Creator.FirstName,
        //             e.Creator.LastName,
        //             e.Creator.DOB,
        //             e.Creator.Email,
        //             e.Creator.Gender,
        //             usersParticipating = e.UsersParticipating.Select(u => new
        //             {
        //                 u.User.FirstName,
        //                 u.User.LastName,
        //             })
        //         })
        //         .Where(x => x.Coords.GetDistanceTo(coord) < distance * 1609.344);

        //     return Ok(events);
        // }


        [HttpPost("save")]
        public async Task<ActionResult<Event>> SaveEventAsync(Event @event)
        {
            return Ok(await _unitOfWork.EventRepository.SaveEventAsync(@event));
        }

    }
}
