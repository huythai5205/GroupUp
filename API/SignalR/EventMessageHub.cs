using System;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using API.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using API.Data;
using API.DTOs;
using API.Interfaces;

namespace API.SignalR
{
    public class EventMessageHub : Hub
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IHubContext<PresenceHub> _presenceHub;
        public EventMessageHub(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            DataContext context,
            IHubContext<PresenceHub> presenceHub
            )
        {
            _unitOfWork = unitOfWork;
            _context = context;
            _presenceHub = presenceHub;
            _mapper = mapper;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var groupName = httpContext.Request.Query["eventId"].ToString();

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var group = await AddToGroupAsync(groupName);
            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

            var messages = await _unitOfWork.EventMessageRepository.
            GetMessageThreadAsync(Context.User.GetUserId(), groupName);

            if (_context.ChangeTracker.HasChanges()) await _context.SaveChangesAsync();

            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var group = await RemoveFromMessageGroupAsync();
            await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
            await base.OnDisconnectedAsync(exception);
        }

        public async void SendMessage(CreateMessageDto createMessageDto)
        {
            var userId = Context.User.GetUserId();

            if (userId == createMessageDto.RecipientId)
                throw new HubException("You cannot send messages to yourself");

            var sender = await _unitOfWork.MemberRepository.GetUserByIdAsync(userId);
            var @event = await _unitOfWork.EventRepository.GetEventByIdAsync(createMessageDto.RecipientId);

            if (@event == null) throw new HubException("Not found event");

            var message = new EventMessage
            {
                Sender = sender,
                Event = @event,
                SenderId = sender.Id,
                EventId = @event.Id,
                Content = createMessageDto.Content
            };

            var groupName = @event.Id;

            var group = await _unitOfWork.EventMessageRepository.GetMessageGroupAsync(groupName);

            _context.EventMessages.Add(message);

            if (await _context.SaveChangesAsync() > 0)
            {
                await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<EventMessageDto>(message));
            }
        }

        private async Task<Group> AddToGroupAsync(string groupName)
        {
            var group = await _unitOfWork.EventMessageRepository.GetMessageGroupAsync(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUserId());

            if (group == null)
            {
                group = new Group(groupName);
                _context.Groups.Add(group);
            }

            group.Connections.Add(connection);

            if (await _context.SaveChangesAsync() > 0) return group;

            throw new HubException("Failed to join group");
        }

        private async Task<Group> RemoveFromMessageGroupAsync()
        {
            var group = await _unitOfWork.EventMessageRepository.GetGroupForConnectionAsync(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            _context.Connections.Remove(connection);
            if (await _context.SaveChangesAsync() > 0) return group;

            throw new HubException("Failed to remove from group");
        }
    }
}