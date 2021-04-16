using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Event
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        public string Name { get; set; }
        public int SpotsAvailable { get; set; }
        public int NumOfParticipants { get; set; } = 1;
        public string Description { get; set; }
        public Address Location { get; set; }
        public DateTime DateOfEvent { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public string CreatorEmail { get; set; }
        public AppUser Creator { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public ICollection<UserEvent> UsersParticipating { get; set; }
        public ICollection<EventMessage> Messages { get; set; }
    }
}