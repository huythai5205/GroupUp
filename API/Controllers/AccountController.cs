using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public AccountController(
            IMapper mapper,
            UserManager<AppUser> userManager,
            ITokenService tokenService,
            DataContext context,
        SignInManager<AppUser> signInManager
        )
        {
            _mapper = mapper;
            _context = context;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult> RegisterAsync(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email.ToLower())) return BadRequest("User already exists");

            AppUser user = _mapper.Map<AppUser>(registerDto);

            user.Email = registerDto.Email.ToLower();
            user.UserName = user.Email;

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            return Ok(new { message = "You are registered now." });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> LoginAsync(LoginDto loginDto)
        {
            AppUser user = await _userManager.Users
            .Include(u => u.EventsCreated)
            .ThenInclude(e => e.Location)
            .Include(u => u.EventsParticipating)
            .ThenInclude(ue => ue.Event)
            .SingleOrDefaultAsync(x => x.Email == loginDto.Email.ToLower());

            if (user == null) return Unauthorized("Invalid Email/Password");

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized("Invalid Email/Password");

            UserDto userToReturn = _mapper.Map<UserDto>(user);
            userToReturn.Token = await _tokenService.CreateToken(user);

            return userToReturn;
        }

        // [HttpPost("add-photo")]
        // public async Task<ActionResult<PhotoDto>> AddPhotoAsync(IFormFile file)
        // {
        //     var user = await _context.Users.SingleOrDefaultAsync(x => x.Email == User.GetUserEmail());
        //     var result = await _photoService.AddPhotoAsync(file);
        //     if (result.Error != null) return BadRequest(result.Error.Message);

        //     var photo = new Photo
        //     {
        //         Url = result.SecureUrl.AbsoluteUri,
        //         PublicId = result.PublicId
        //     };

        //     user.ProfilePic = photo;

        //     if (await _context.SaveChangesAsync() > 0)
        //     {
        //         return CreatedAtRoute("GetUser", new { email = user.Email }, _mapper.Map<PhotoDto>(photo));
        //     }

        //     return BadRequest("Problem addding photo");
        // }

        [HttpPost("addEvent")]
        public async Task<ActionResult> AddEventAsync([FromBody] UserEvent userEvent)
        {
            if (await _context.UserEvents.FindAsync(userEvent.UserId, userEvent.EventId) != null) return BadRequest("You're already attending to the event");
            userEvent.User = await _context.Users.FindAsync(userEvent.UserId);
            userEvent.Event = await _context.Events
                .Where(e => e.Id == userEvent.EventId)
                 .SingleOrDefaultAsync();

            int numParticipants = userEvent.Event.NumOfParticipants;
            if (numParticipants < userEvent.Event.SpotsAvailable)
            {
                userEvent.Event.NumOfParticipants = ++numParticipants;
            }
            else
            {
                return BadRequest("Event is Full");
            }

            await _context.UserEvents.AddAsync(userEvent);
            await _context.SaveChangesAsync();

            return Ok(userEvent.Event);
        }

    }
}

