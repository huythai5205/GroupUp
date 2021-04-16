namespace API.Models
{
    public class UserEvent
    {

        public string UserId { get; set; }
        public AppUser User { get; set; }
        public string EventId { get; set; }
        public Event Event { get; set; }
    }
}
