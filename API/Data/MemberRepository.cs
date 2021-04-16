
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Interfaces;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MemberRepository : IMemberRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MemberRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<UserDto> GetMemberDetailAsync(string memberId)
        {
            AppUser user = await _context.Users
                        .Include(u => u.EventsCreated)
                        .ThenInclude(e => e.Location)
                        .Include(u => u.EventsParticipating)
                        .ThenInclude(ue => ue.Event)
                        .SingleOrDefaultAsync(user => user.Id == memberId);

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> GetMemberAsync(string email)
        {
            var user = await _context.Users
                .Where(x => x.Email == email)
                .SingleOrDefaultAsync();
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> GetMemberByIdAsync(string memberId)
        {
            var user = await _context.Users
                .Where(x => x.Id == memberId)
                .SingleOrDefaultAsync();
            return _mapper.Map<UserDto>(user);
        }

        public async Task<AppUser> GetUserByIdAsync(string userId)
        {
            return await _context.Users
                .Where(x => x.Id == userId)
                .SingleOrDefaultAsync();
        }

        public async Task<UserDto[]> GetMembersAsync()
        {
            return await _context.Users
                .Include(p => p.ProfilePic.Url)
                .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}