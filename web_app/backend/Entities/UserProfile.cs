using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Entities
{
    public class UserProfile
    {
        [Key]
        public string UserId { get; set; } = null!; // also foreign key
        public virtual User Owner { get; set; } = null!;
        public virtual UserAddress Address { get; set; } = null!;

        public string? BandId { get; set; } // foreign key
        [JsonIgnore]
        public virtual MusicalBand? Band { get; set; }

        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public byte Age { get; set; }
        public string? Occupation { get; set; }

        //public List<string>? PlayedInstruments { get; set; }
        public string? PlayedInstrument { get; set; }
        public string? PreferredMusicGenre { get; set; }
        public bool CanSing { get; set; }

        public string? Trait1 { get; set; }
        public string? Trait2 { get; set; }
    }
}
