using System;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Helpers;
using API.Interfaces;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class EventRepository : IEventRepository
    {
        private DataContext _context;
        private IMapper _mapper;

        public EventRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Event> GetEventByIdAsync(string eventId)
        {
            return await _context.Events
                .Where(e => e.Id == eventId)
                .Include(e => e.Location)
                .Include(e => e.UsersParticipating)
                .ThenInclude(e => e.User)
                .SingleOrDefaultAsync();
        }

        public async Task<PagedList<EventDto>> GetEventsAsync(EventParams eventParams)
        {
            var query = _context.Events.AsQueryable();

            if (eventParams.City != "null")
            {
                query = query.Where(e => e.Location.City == eventParams.City
                                && e.Location.State == eventParams.State);
            }


            query = eventParams.OrderBy switch
            {
                "Created" => query.OrderByDescending(e => e.Created),
                _ => query.OrderByDescending(e => e.DateOfEvent)
            };

            return await PagedList<EventDto>
                .CreateAsync(query.ProjectTo<EventDto>(_mapper
                .ConfigurationProvider).AsNoTracking(),
                eventParams.PageNumber, eventParams.PageSize);
        }

        public async Task<UserDto[]> GetParticipantsAsync(string eventId)
        {
            return await _context.Users
                .Where(u => u.EventsParticipating
                .Any(userEvent => userEvent.EventId == eventId))
                .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
        }

        public async Task<string[]> GetStatesAsync()
        {
            return await _context.Addresses
                .OrderBy(a => a.State).Select(a => a.State)
                .Distinct().ToArrayAsync();
        }

        public async Task<string[]> GetCitiesAsync(string state)
        {
            return await _context.Addresses
                .Where(a => a.State.Equals(state))
                .Select(a => a.City)
                .Distinct()
                .ToArrayAsync();
        }

        public async Task<ActionResult<Event>> SaveEventAsync(Event @event)
        {
            Event updatedEvent;
            if (@event.Id == "")
            {
                @event.Id = Guid.NewGuid().ToString();
                @event.Creator = await _context.Users.FirstOrDefaultAsync(u => u.Email == @event.CreatorEmail);
                updatedEvent = (await _context.Events.AddAsync(@event)).Entity;
            }
            else
            {
                updatedEvent = _context.Events.Update(@event).Entity;
            }

            var result = await _context.SaveChangesAsync();
            return updatedEvent;
        }
    }
}