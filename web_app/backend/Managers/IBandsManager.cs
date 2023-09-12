using backend.Models;

namespace backend.Managers
{
    public interface IBandsManager
    {
        List<MusicalBandModel> GetMusicalBands();
        MusicalBandModel? GetCompleteBandById(string bandId);

        string CreateMusicalBand(MusicalBandModel model, string userId);
        bool UpdateMusicalBand(MusicalBandModel model);
        void DeleteMusicalBand(string bandId);
        void LeaveBand(string userId);

        void SaveBandUserMatches(BandUserMatchModel[] models);
        List<SurveyResultModel> GetBandMatches(string bandId);
        void UpdateBandUserMatch(BandUserMatchModel model);
        void DeleteBandMatches(string bandId);

        List<MusicalBandModel> GetBandsWithNoMembers();
    }
}
