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
            return db.MusicalBands.Include(band => band.HQ).Include(band => band.Members).ThenInclude(profile => profile.Owner); 
        }

        public MusicalBand? GetBandById(string bandId)
        {
            return GetMusicalBands().FirstOrDefault(band => band.BandId == bandId);
        }

        public MusicalBand? GetBandWithMembers(string bandId)
        {
            return GetMusicalBands().FirstOrDefault(band => band.BandId == bandId);
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



        public void AddBandUserMatches(List<BandUserMatch> matches)
        {
            foreach (BandUserMatch match in matches)
                db.BandUserMatches.Add(match);
            db.SaveChanges();
        }


        private IQueryable<BandUserMatch> GetMatchesByBandId(string bandId)
        {
            string[] matchTypes = { "survey match", "invitation", "declined invitation", "invalid invitation" };
            var matches = db.BandUserMatches.Where(match => matchTypes.Contains(match.MatchType));
            return matches.Where(match => match.BandId == bandId);
        }


        public IQueryable<BandUserMatch> GetBandMatchedProfiles(string bandId)
        {
            return GetMatchesByBandId(bandId)
                .Include(match => match.UserProfile).ThenInclude(profile => profile.Owner)
                .Include(match => match.UserProfile).ThenInclude(profile => profile.Address);
        }


        public BandUserMatch? GetMatchToUpdate(string bandId, string userId)
        {
            var matches = GetMatchesByBandId(bandId);
            return matches.FirstOrDefault(match => (match.UserId == userId));
        }


        public void UpdateBandUserMatch(BandUserMatch match)
        {
            db.BandUserMatches.Update(match);
            db.SaveChanges();
        }


        public void RemoveBandMatches(string bandId)
        {
            var matches = db.BandUserMatches.Where(match => match.BandId == bandId);
            foreach (BandUserMatch match in matches)
                db.BandUserMatches.Remove(match);
            db.SaveChanges();
        }


        //public void RemoveBandUserMatch(BandUserMatch match)
        //{
        //    db.BandUserMatches.Remove(match);
        //    db.SaveChanges();
        //}
    }
}
