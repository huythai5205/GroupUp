using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class EventMessage
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        public string SenderId { get; set; }
        public AppUser Sender { get; set; }
        public string EventId { get; set; }
        public Event Event { get; set; }
        public string Content { get; set; }
        public DateTime MessageSent { get; set; } = DateTime.UtcNow;
    }
}