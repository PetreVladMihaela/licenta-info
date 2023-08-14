using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

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


        public void UpdateBandId(string userId, string? bandId)
        {
            var profile = GetProfilesIQueryable().FirstOrDefault(p => p.Owner.Id == userId);
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


        public IQueryable<UserProfile> GetFilteredProfiles(BandMembersSurveyModel survey)
        {
            var result = db.UserProfiles.Include(profile => profile.Address).Include(profile => profile.Owner)
                .Where(profile => profile.BandId == null)
                .Where(profile => survey.MinAge <= profile.Age & profile.Age <= survey.MaxAge)
                .Where(profile => profile.Address.Country == survey.Country)
                .Where(profile => profile.Address.City == survey.City);

            if (survey.Street is not null && survey.Street != "")
                result = result.Where(profile => profile.Address.Street == survey.Street);

            if (survey.CanSing)
                result = result.Where(profile => profile.CanSing == true);

            if (survey.PlayedInstrument is not null && survey.PlayedInstrument != "")
                result = result.Where(p => p.PlayedInstrument != null && p.PlayedInstrument.ToLower() == survey.PlayedInstrument.ToLower());

            if (survey.PreferredMusicGenre is not null && survey.PreferredMusicGenre != "")
                result = result.Where(p => (p.PreferredMusicGenre != null && p.PreferredMusicGenre.ToLower() == survey.PreferredMusicGenre.ToLower())
                                                || p.PreferredMusicGenre == null);


            if (survey.Trait1 is not null && survey.Trait2 is not null)
            {
                var profiles1 = result.Where(p => p.Trait1 == survey.Trait1 && p.Trait2 == survey.Trait2);
                var profiles2 = result.Where(p => p.Trait2 == survey.Trait1 && p.Trait1 == survey.Trait2);
                result = profiles1.Concat(profiles2);
            }
            else
            {
                string? surveyTrait = null;
                if (survey.Trait1 is not null) surveyTrait = survey.Trait1;
                if (survey.Trait2 is not null) surveyTrait = survey.Trait2;
                if (surveyTrait is not null)
                    result = result.Where(p => p.Trait1 == surveyTrait || p.Trait2 == surveyTrait);
            }


            if (survey.Occupation is not null && survey.Occupation != "")
            {
                var profiles = result.Where(p => p.Occupation != null && p.Occupation.ToLower() == survey.Occupation.ToLower());
                if (profiles.Any())
                    result = profiles;
            }

            return result;
        }


        public IQueryable<BandUserMatch> GetInvitationsToJoinBands(string userId)
        {
            var invitations = db.BandUserMatches.Where(match => match.MatchType == "invitation");
            return invitations.Where(invite => invite.UserId == userId).Include(match => match.MusicalBand);
        }


        public void UpdateUserInvitations(string userId, string? bandId)
        {
            if (bandId is not null)
            {
                BandUserMatch? acceptedInvite = db.BandUserMatches.FirstOrDefault(match => match.UserId == userId 
                                                                                        && match.BandId == bandId);
                if (acceptedInvite is not null)
                    db.BandUserMatches.Remove(acceptedInvite);
            }

            var otherInvites = GetInvitationsToJoinBands(userId);
            foreach (BandUserMatch invitation in otherInvites)
            {
                invitation.MatchType = "invalid invitation"; 
                db.BandUserMatches.Update(invitation);
            }

            db.SaveChanges();
        }

    }
}
