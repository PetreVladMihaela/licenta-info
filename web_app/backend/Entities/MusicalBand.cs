using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class MusicalBand
    {
        [Key]
        public string BandId { get; set; } = null!;
        public virtual BandHQ? HQ { get; set; }

        public string Name { get; set; } = null!;
        public string? MusicGenre { get; set; }
        public DateTime DateFormed { get; set; }
        public bool IsComplete { get; set; }

        //public string CreatorId { get; set; }
        public virtual ICollection<UserProfile> Members { get; set; } = new Collection<UserProfile>();
        public virtual ICollection<BandUserMatch>? Matches { get; set; }
    }
}
