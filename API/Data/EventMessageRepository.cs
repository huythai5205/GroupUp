using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Helpers;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class EventMessageRepository : IEventMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public EventMessageRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public void DeleteMessage(EventMessage message)
        {
            _context.EventMessages.Remove(message);
        }

        public async Task<Group> GetGroupForConnectionAsync(string connectionId)
        {
            return await _context.Groups
              .Include(c => c.Connections)
              .Where(c => c.Connections.Any(x => x.ConnectionId == connectionId))
              .FirstOrDefaultAsync();
        }

        public async Task<EventMessage> GetMessageAsync(string id)
        {
            return await _context.EventMessages
             .Include(u => u.Sender)
             .Include(u => u.Event)
             .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Group> GetMessageGroupAsync(string groupName)
        {
            return await _context.Groups
                  .Include(x => x.Connections)
                  .FirstOrDefaultAsync(x => x.Name == groupName);
        }

        public async Task<IEnumerable<EventMessageDto>> GetMessageThreadAsync(string currentUserId, string eventId)
        {
            var messages = await _context.EventMessages
            .Include(u => u.Sender).ThenInclude(p => p.ProfilePic)
            .Include(u => u.Event)
            .Where(m => m.Sender.Id == currentUserId
                    && m.Event.Id == eventId
            )
            .OrderBy(m => m.MessageSent)
            .ToListAsync();

            return _mapper.Map<IEnumerable<EventMessageDto>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}