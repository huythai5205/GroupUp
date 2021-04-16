using System;
using API.Models;

namespace API.DTOs
{
    public class EventMessageDto
    {
        public string Id { get; set; }
        public string SenderId { get; set; }
        public string SenderPhotoUrl { get; set; }
        public string EventId { get; set; }
        public string Content { get; set; }
        public DateTime MessageSent { get; set; } = DateTime.UtcNow;
    }
}