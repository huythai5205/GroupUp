using System;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using API.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using API.DTOs;
using API.Interfaces;

namespace API.SignalR
{
    public class MemberMessageHub : Hub
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _tracker;
        public MemberMessageHub(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IHubContext<PresenceHub> presenceHub,
            PresenceTracker tracker)
        {
            _unitOfWork = unitOfWork;
            _tracker = tracker;
            _presenceHub = presenceHub;
            _mapper = mapper;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var recipientId = httpContext.Request.Query["memberId"].ToString();

            var groupName = GetGroupName(Context.User.GetUserId(), recipientId);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var group = await AddToGroupAsync(groupName);
            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

            if (!String.IsNullOrEmpty(recipientId))
            {
                var messages = await _unitOfWork.MemberMessageRepository.
                                GetMessageThreadAsync(Context.User.GetUserId(), recipientId);

                if (_unitOfWork.HasChanges()) await _unitOfWork.CompleteAsync();

                await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
            }


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
            var recipient = await _unitOfWork.MemberRepository.GetUserByIdAsync(createMessageDto.RecipientId);

            if (recipient == null) throw new HubException("Not found user");

            var message = new MemberMessage
            {
                Sender = sender,
                Recipient = recipient,
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                Content = createMessageDto.Content
            };

            var groupName = GetGroupName(sender.Id, recipient.Id);

            var group = await _unitOfWork.MemberMessageRepository.GetMessageGroupAsync(groupName);

            if (group.Connections.Any(x => x.RecipientId == recipient.Id))
            {
                message.DateRead = DateTime.UtcNow;
            }
            else
            {
                var connections = await _tracker.GetConnectionsForUser(recipient.Id);
                if (connections != null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived",
                        new { memberId = sender.Id, firstName = sender.FirstName });
                }
            }

            _unitOfWork.MemberMessageRepository.AddMessage(message);

            if (await _unitOfWork.CompleteAsync())
            {
                await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MemberMessageDto>(message));
            }
        }

        private async Task<Group> AddToGroupAsync(string groupName)
        {
            var group = await _unitOfWork.MemberMessageRepository.GetMessageGroupAsync(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUserId());

            if (group == null)
            {
                group = new Group(groupName);
                _unitOfWork.MemberMessageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            if (await _unitOfWork.CompleteAsync()) return group;

            throw new HubException("Failed to join group");
        }

        private async Task<Group> RemoveFromMessageGroupAsync()
        {
            var group = await _unitOfWork.MemberMessageRepository.GetGroupForConnectionAsync(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            _unitOfWork.MemberMessageRepository.RemoveConnection(connection);
            if (await _unitOfWork.CompleteAsync()) return group;

            throw new HubException("Failed to remove from group");
        }

        private string GetGroupName(string senderId, string recipientId)
        {
            var stringCompare = string.CompareOrdinal(senderId, recipientId) < 0;
            return stringCompare ? $"{senderId}-{recipientId}" : $"{recipientId}-{senderId}";
        }
    }
}