namespace backend.Models
{
    public class BandHqModel
    {
        //public string BandId { get; set; } = null!;
        public string Country { get; set; } = null!;
        public string City { get; set; } = null!;
        public string? Street { get; set; }
        public int? SquareMeters { get; set; }
    }
}
