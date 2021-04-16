using System;

namespace API.DTOs
{
    public class MemberDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public DateTime DOB { get; set; }
        public string ProfilePic { get; set; }
        public bool Terms { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
    }
}