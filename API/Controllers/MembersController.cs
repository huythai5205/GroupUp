
using System.Threading.Tasks;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MembersController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        public MembersController(
            IUnitOfWork unitOfWork
            )
        {
            _unitOfWork = unitOfWork;
        }
        [HttpGet("{memberId}")]
        public async Task<ActionResult<UserDto>> GetMemberDetailAsync(string memberId)
        {
            return Ok(await _unitOfWork.MemberRepository.GetMemberDetailAsync(memberId));
        }

        public async Task<ActionResult<UserDto>> GetMemberAsync(string email)
        {
            return Ok(await _unitOfWork.MemberRepository.GetMemberAsync(email));
        }
    }
}