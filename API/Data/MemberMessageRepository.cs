using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Models;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using API.Helpers;
using AutoMapper.QueryableExtensions;

namespace API.Data
{
    public class MemberMessageRepository : IMemberMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MemberMessageRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public void AddGroup(Group group)
        {
            _context.Groups.Add(group);
        }

        public void DeleteMessage(MemberMessage message)
        {
            _context.MemberMessages.Remove(message);
        }

        public async Task<Group> GetGroupForConnectionAsync(string connectionId)
        {
            return await _context.Groups
                .Include(c => c.Connections)
                .Where(c => c.Connections.Any(x => x.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public async Task<MemberMessage> GetMessageAsync(string id)
        {
            return await _context.MemberMessages
                .Include(u => u.Sender)
                .Include(u => u.Recipient)
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Group> GetMessageGroupAsync(string groupName)
        {
            return await _context.Groups
                 .Include(x => x.Connections)
                 .FirstOrDefaultAsync(x => x.Name == groupName);
        }

        public async Task<PagedList<MemberMessageDto>> GetMessagesAsync(MessageParams messageParams)
        {
            var query = _context.MemberMessages
              .OrderByDescending(m => m.MessageSent)
              .ProjectTo<MemberMessageDto>(_mapper.ConfigurationProvider)
              .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.RecipientId == messageParams.UserId
                    && u.RecipientDeleted == false),
                "Outbox" => query.Where(u => u.SenderId == messageParams.UserId
                    && u.SenderDeleted == false),
                _ => query.Where(u => u.RecipientId ==
                    messageParams.UserId && u.RecipientDeleted == false && u.DateRead == null)
            };

            return await PagedList<MemberMessageDto>.CreateAsync(query, messageParams.PageNumber, messageParams.PageSize);

        }

        public async Task<IEnumerable<MemberMessageDto>> GetMessageThreadAsync(string currentUserId,
            string recipientId)
        {
            var messages = await _context.MemberMessages
                .Include(u => u.Sender).ThenInclude(p => p.ProfilePic)
                .Include(u => u.Recipient).ThenInclude(p => p.ProfilePic)
                .Where(m => m.Recipient.Id == currentUserId && m.RecipientDeleted == false
                        && m.Sender.Id == recipientId
                        || m.Recipient.Id == recipientId
                        && m.Sender.Id == currentUserId && m.SenderDeleted == false
                )
                .OrderBy(m => m.MessageSent)
                .ToListAsync();

            var unreadMessages = messages.Where(m => m.DateRead == null
                && m.Recipient.Id == recipientId).ToList();

            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MemberMessageDto>>(messages);
        }
        public void AddMessage(MemberMessage message)
        {
            _context.MemberMessages.Add(message);
        }

        public void RemoveConnection(Connection connection)
        {
            _context.Connections.Remove(connection);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}