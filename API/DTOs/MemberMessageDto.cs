using System;
using System.Text.Json.Serialization;

namespace API.DTOs
{
    public class MemberMessageDto
    {
        public string Id { get; set; }
        public string SenderId { get; set; }
        public string SenderPhotoUrl { get; set; }
        public string RecipientId { get; set; }
        public string RecipientPhotoUrl { get; set; }
        public string Content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; }

        [JsonIgnore]
        public bool SenderDeleted { get; set; }

        [JsonIgnore]
        public bool RecipientDeleted { get; set; }
    }
}