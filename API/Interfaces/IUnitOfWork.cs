using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IEventRepository EventRepository { get; }
        IEventMessageRepository EventMessageRepository { get; }
        IMemberMessageRepository MemberMessageRepository { get; }
        IMemberRepository MemberRepository { get; }
        Task<bool> CompleteAsync();
        bool HasChanges();

    }
}