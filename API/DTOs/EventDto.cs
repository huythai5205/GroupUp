using System;
using System.Collections.Generic;
using API.Models;

namespace API.DTOs
{
    public class EventDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int SpotsAvailable { get; set; }
        public int NumOfParticipants { get; set; }
        public string Description { get; set; }
        public Address Location { get; set; }
        public DateTime DateOfEvent { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public DateTime Created { get; set; }
        public string CreatorEmail { get; set; }
        public MemberDto Creator { get; set; }
        public ICollection<MemberDto> UsersParticipating { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }
    }
}