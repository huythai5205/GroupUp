using System.Threading.Tasks;
using API.Interfaces;
using AutoMapper;

namespace API.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;
        public UnitOfWork(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public IEventRepository EventRepository => new EventRepository(_context, _mapper);

        public IEventMessageRepository EventMessageRepository => new EventMessageRepository(_context, _mapper);

        public IMemberMessageRepository MemberMessageRepository => new MemberMessageRepository(_context, _mapper);

        public IMemberRepository MemberRepository => new MemberRepository(_context, _mapper);

        public async Task<bool> CompleteAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            _context.ChangeTracker.DetectChanges();
            var changes = _context.ChangeTracker.HasChanges();

            return changes;
        }
    }
}