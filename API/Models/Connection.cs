namespace API.Models
{
    public class Connection
    {
        public Connection()
        {
        }

        public Connection(string connectionId, string recipientId)
        {
            ConnectionId = connectionId;
            RecipientId = recipientId;
        }

        public string ConnectionId { get; set; }
        public string RecipientId { get; set; }
    }
}