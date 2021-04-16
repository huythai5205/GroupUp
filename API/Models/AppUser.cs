using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace API.Models
{
    public class AppUser : IdentityUser<string>
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public DateTime DOB { get; set; }
        public ICollection<Event> EventsCreated { get; set; }
        public ICollection<UserEvent> EventsParticipating { get; set; }
        public Photo ProfilePic { get; set; }
        public bool Terms { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;
        public ICollection<AppUserRole> UserRoles { get; set; }
        public ICollection<MemberMessage> MessagesSent { get; set; }
        public ICollection<MemberMessage> MessagesReceived { get; set; }

    }
}