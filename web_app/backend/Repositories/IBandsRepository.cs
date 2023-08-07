using backend.Entities;

namespace backend.Repositories
{
    public interface IBandsRepository
    {
        IQueryable<MusicalBand> GetMusicalBands();
        public MusicalBand? GetBandById(string bandId);
        public MusicalBand? GetBandWithMembers(string bandId);

        void CreateBand(MusicalBand band, BandHQ? bandHQ);
        void CreateBandHQ(BandHQ bandHQ);
        void UpdateBand(MusicalBand band, BandHQ? bandHQ);
        void DeleteBand(MusicalBand band);
    }
}
