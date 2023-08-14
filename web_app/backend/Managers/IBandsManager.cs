using backend.Entities;
using backend.Models;

namespace backend.Managers
{
    public interface IBandsManager
    {
        List<MusicalBand> GetMusicalBands();
        MusicalBandModel? GetCompleteBandById(string bandId);

        string CreateMusicalBand(MusicalBandModel model, string userId);
        bool UpdateMusicalBand(MusicalBandModel model);
        void DeleteMusicalBand(string bandId);

        void SaveBandUserMatches(BandUserMatchModel[] models);
        List<SurveyResultModel> GetBandMatches(string bandId);
        void UpdateBandUserMatch(BandUserMatchModel model);
        void DeleteBandMatches(string bandId);
    }
}
