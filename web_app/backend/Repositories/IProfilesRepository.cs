using backend.Entities;
using backend.Models;

namespace backend.Repositories
{
    public interface IProfilesRepository
    {
        IQueryable<UserProfile> GetProfilesIQueryable();
        UserProfile? GetProfileByOwnerUsername(string username);

        void CreateProfile(UserProfile profile, UserAddress address);
        void UpdateProfile(UserProfile profile, UserAddress address);
        void UpdateBandId(string userId, string? bandId);
        void DeleteProfile(string username);

        public IQueryable<UserProfile> GetFilteredProfiles(BandMembersSurveyModel survey);
        public IQueryable<BandUserMatch> GetInvitationsToJoinBands(string userId);
        void UpdateUserInvitations(string userId, string? bandId);
    }
}
