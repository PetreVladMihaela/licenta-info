using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Entities
{
    public class BandHQ
    {
        [Key]
        public string BandId { get; set; } = null!; // also foreign key
        [JsonIgnore]
        public virtual MusicalBand Band { get; set; } = null!;

        public string Country { get; set; } = null!;
        public string City { get; set; } = null!;
        public string? Street { get; set; }
        public int? SquareMeters { get; set; }
    }
}
