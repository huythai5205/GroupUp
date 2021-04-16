namespace API.Helpers
{
    public class EventParams : PaginationParams
    {
        public string City { get; set; } = null;
        public string State { get; set; } = null;
        public int DistanceWithin { get; set; } = 0;
        public int Longitude { get; set; } = 0;
        public int Latitude { get; set; } = 0;
        public string OrderBy { get; set; } = "Created";
    }
}