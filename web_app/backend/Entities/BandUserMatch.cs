namespace backend.Entities
{
    public class BandUserMatch
    {
        public string BandId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string MatchType { get; set; } = null!;

        public virtual MusicalBand MusicalBand { get; set; } = null!;
        public virtual UserProfile UserProfile { get; set; } = null!;
    }
}
