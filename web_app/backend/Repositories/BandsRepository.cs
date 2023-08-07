using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class BandsRepository : IBandsRepository
    {
        private readonly DatabaseContext db;

        public BandsRepository(DatabaseContext db)
        {
            this.db = db;
        }

        public IQueryable<MusicalBand> GetMusicalBands()
        {
            return db.MusicalBands.Include(band => band.HQ); 
        }

        public MusicalBand? GetBandById(string bandId)
        {
            return GetMusicalBands().FirstOrDefault(band => band.BandId == bandId);
        }

        public MusicalBand? GetBandWithMembers(string bandId)
        {
            var bands = GetMusicalBands().Include(band => band.Members).ThenInclude(profile => profile.Owner);
            return bands.FirstOrDefault(band => band.BandId == bandId);
        }


        public void CreateBand(MusicalBand band, BandHQ? bandHQ)
        {
            db.MusicalBands.Add(band);

            if (bandHQ is not null)
                db.BandHeadquarters.Add(bandHQ);

            db.SaveChanges();
        }

        public void UpdateBand(MusicalBand band, BandHQ? bandHQ)
        {
            db.MusicalBands.Update(band);

            if (bandHQ is not null)
                db.BandHeadquarters.Update(bandHQ);

            db.SaveChanges();
        }


        public void CreateBandHQ(BandHQ bandHQ)
        {    
            db.BandHeadquarters.Add(bandHQ);
            db.SaveChanges();
        }


        public void DeleteBand(MusicalBand band)
        {
            db.MusicalBands.Remove(band);
            db.SaveChanges();
        }
    }
}
