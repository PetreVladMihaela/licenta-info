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

        List<SurveyResultModel> GetSurveyResults(BandMembersSurveyModel surveyModel);
        List<InvitationModel> GetInvitationsToJoinBands(string userId);
        void AcceptInvitationToJoinBand(BandUserMatchModel invitation);

        void SaveProfileImage(string username, byte[] image);
        void DeleteProfileImage(string username);
    }
}
