using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Helpers;
using API.Models;

namespace API.Interfaces
{
    public interface IMemberMessageRepository
    {
        void AddGroup(Group group);
        Task<Group> GetMessageGroupAsync(string groupName);
        Task<Group> GetGroupForConnectionAsync(string connectionId);
        void DeleteMessage(MemberMessage message);
        Task<MemberMessage> GetMessageAsync(string id);
        Task<PagedList<MemberMessageDto>> GetMessagesAsync(MessageParams memberMessageParams);
        Task<IEnumerable<MemberMessageDto>> GetMessageThreadAsync(string currentUserId, string recipientId);
        void AddMessage(MemberMessage message);
        void RemoveConnection(Connection connection);
        Task<bool> SaveAllAsync();
    }
}