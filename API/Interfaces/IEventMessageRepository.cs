using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Models;

namespace API.Interfaces
{
    public interface IEventMessageRepository
    {
        Task<Group> GetMessageGroupAsync(string groupName);
        Task<Group> GetGroupForConnectionAsync(string connectionId);
        void DeleteMessage(EventMessage message);
        Task<EventMessage> GetMessageAsync(string id);
        Task<IEnumerable<EventMessageDto>> GetMessageThreadAsync(string currentUserId, string recipientId);
        Task<bool> SaveAllAsync();
    }
}