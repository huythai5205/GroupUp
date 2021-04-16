using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MemberMessagesController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public MemberMessagesController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberMessageDto>>> GetMessagesForUser([FromQuery]
            MessageParams messageParams)
        {
            messageParams.UserId = User.GetUserId();

            var messages = await _unitOfWork.MemberMessageRepository.GetMessagesAsync(messageParams);

            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize,
                messages.TotalCount, messages.TotalPages);

            return messages;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(string id)
        {
            var userId = User.GetUserId();

            var message = await _unitOfWork.MemberMessageRepository.GetMessageAsync(id);

            if (message.Sender.Id != userId && message.Recipient.Id != userId)
                return Unauthorized();

            if (message.Sender.Id == userId) message.SenderDeleted = true;

            if (message.Recipient.Id == userId) message.RecipientDeleted = true;

            if (message.SenderDeleted && message.RecipientDeleted)
                _unitOfWork.MemberMessageRepository.DeleteMessage(message);

            if (await _unitOfWork.CompleteAsync()) return Ok();

            return BadRequest("Problem deleting the message");
        }
    }
}