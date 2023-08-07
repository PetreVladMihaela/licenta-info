using backend.Entities;
using backend.Models;

namespace backend.Managers
{
    public interface IBandsManager
    {
        List<MusicalBand> GetMusicalBands();
        MusicalBandModel? GetCompleteBandById(string bandId);

        string CreateMusicalBand(MusicalBandModel model, string username);
        bool UpdateMusicalBand(MusicalBandModel model);
        void DeleteMusicalBand(string bandId);
    }
}
