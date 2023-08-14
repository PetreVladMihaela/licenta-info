using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class BandMembersSurveyModel
    {
        [Required]
        public string Country { get; set; } = null!;
        [Required]
        public string City { get; set; } = null!;
        public string? Street { get; set; }

        public byte MinAge { get; set; } // default 0
        public byte MaxAge { get; set; } = 100;
        public string? Occupation { get; set; }

        public bool CanSing { get; set; }
        public string? PlayedInstrument { get; set; }
        public string? PreferredMusicGenre { get; set; }

        public string? Trait1 { get; set; }
        public string? Trait2 { get; set; }
    }
}
