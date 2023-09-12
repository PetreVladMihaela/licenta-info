using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class MusicalBandModel
    {
        [Required]
        public string BandId { get; set; } = null!;
        [Required]
        public string Name { get; set; } = null!;

        public string? MusicGenre { get; set; }
        public DateTime DateFormed { get; set; }
        public bool IsComplete { get; set; }

        public BandHqModel? HQ { get; set; }
        public List<UserProfileModel> Members { get; set; } = new List<UserProfileModel>();
    }


    public class BandHqModel
    {
        //public string BandId { get; set; } = null!;
        public string Country { get; set; } = null!;
        public string City { get; set; } = null!;
        public string? Street { get; set; }
        public int? SquareMeters { get; set; }
    }

}
