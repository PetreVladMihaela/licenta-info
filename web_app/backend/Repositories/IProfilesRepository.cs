using backend.Entities;

namespace backend.Repositories
{
    public interface IProfilesRepository
    {
        IQueryable<UserProfile> GetProfilesIQueryable();
        UserProfile? GetProfileByOwnerUsername(string username);

        void CreateProfile(UserProfile profile, UserAddress address);
        void UpdateProfile(UserProfile profile, UserAddress address);
        void UpdateBandId(string username, string? bandId);
        void DeleteProfile(string username);
    }
}
