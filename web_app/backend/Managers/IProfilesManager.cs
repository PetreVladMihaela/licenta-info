using backend.Entities;
using backend.Models;

namespace backend.Managers
{
    public interface IProfilesManager
    { 
        List<UserProfile> GetUserProfiles();
        UserProfileModel? GetProfileByUsername(string username);

        void CreateUserProfile(UserProfileModel model, string userId);
        void UpdateUserProfile(UserProfileModel model);
        void DeleteUserProfile(string username);
    }
}
