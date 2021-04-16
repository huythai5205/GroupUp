using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Interfaces
{
    public interface IMemberRepository
    {
        void Update(AppUser user);
        Task<bool> SaveAllAsync();
        Task<UserDto> GetMemberDetailAsync(string memberId);
        Task<UserDto> GetMemberAsync(string email);
        Task<UserDto[]> GetMembersAsync();
        Task<UserDto> GetMemberByIdAsync(string id);
        Task<AppUser> GetUserByIdAsync(string userId);
    }
}