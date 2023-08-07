using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class ProfilesRepository : IProfilesRepository
    {
        private readonly DatabaseContext db;

        public ProfilesRepository(DatabaseContext db)
        {
            this.db = db;
        }

        public IQueryable<UserProfile> GetProfilesIQueryable()
        {
            var profiles = db.UserProfiles.Include(p => p.Owner).Include(p => p.Address).Include(p => p.Band);
            if (profiles is not null) return profiles;
            else return Enumerable.Empty<UserProfile>().AsQueryable();
        }


        public UserProfile? GetProfileByOwnerUsername(string username)
        {
            return GetProfilesIQueryable().FirstOrDefault(p => p.Owner.UserName == username);
        }


        public void CreateProfile(UserProfile profile, UserAddress address)
        {
            db.UserProfiles.Add(profile);
            db.UserAddresses.Add(address);
            db.SaveChanges();
        }


        public void UpdateProfile(UserProfile profile, UserAddress address)
        {
            db.UserProfiles.Update(profile);
            db.UserAddresses.Update(address);
            db.SaveChanges();
        }


        public void UpdateBandId(string username, string? bandId)
        {
            var profile = GetProfileByOwnerUsername(username);
            if (profile is not null)
            {
                profile.BandId = bandId;
                db.UserProfiles.Update(profile);
                db.SaveChanges();
            }
        }


        public void DeleteProfile(string username)
        {
            var profile = GetProfileByOwnerUsername(username);
            if (profile is not null)
            {
                db.UserProfiles.Remove(profile);
                db.SaveChanges();
            }
        }
    }
}
