using backend.Entities;
using backend.Models;
using backend.Repositories;


namespace backend.Managers
{
    public class BandsManager : IBandsManager
    {
        private readonly IBandsRepository bandsRepository;
        private readonly IProfilesRepository profilesRepository;

        public BandsManager(IBandsRepository bandsRepository, IProfilesRepository profilesRepository)
        {
            this.bandsRepository = bandsRepository;
            this.profilesRepository = profilesRepository;
        }

        public List<MusicalBand> GetMusicalBands()
        {
            return bandsRepository.GetMusicalBands().ToList();
        }


        public MusicalBandModel? GetCompleteBandById(string bandId)
        {
            MusicalBand? band = bandsRepository.GetBandWithMembers(bandId);

            if (band is not null)
            {
                List<UserProfileModel> members = new();
                foreach (UserProfile member in band.Members)
                {
                    UserProfileModel profileModel = new()
                    {
                        Username = member.Owner.UserName,
                        Email = member.Owner.Email,
                        FirstName = member.FirstName,
                        LastName = member.LastName,
                        PlayedInstrument = member.PlayedInstrument,
                        CanSing = member.CanSing
                    };
                    members.Add(profileModel);
                }

                BandHqModel? hqModel = null;
                BandHQ? bandHQ = band.HQ;
                if (bandHQ is not null)
                {
                    hqModel = new()
                    {
                        Country = bandHQ.Country,
                        City = bandHQ.City,
                        Street = bandHQ.Street,
                        SquareMeters = bandHQ.SquareMeters
                    };
                }

                MusicalBandModel bandModel = new()
                {
                    BandId = band.BandId,
                    Name = band.Name,
                    MusicGenre = band.MusicGenre,
                    DateFormed = band.DateFormed,
                    IsComplete = band.IsComplete,
                    HQ = hqModel,
                    Members = members
                };

                return bandModel;
            }
            else return null;
        }


        public string CreateMusicalBand(MusicalBandModel bandModel, string userId)
        {
            string bandId = Guid.NewGuid().ToString();

            MusicalBand newBand = new()
            {
                BandId = bandId,
                Name = bandModel.Name,
                MusicGenre = bandModel.MusicGenre,
                DateFormed = DateTime.Now.ToUniversalTime()
            };

            BandHqModel? hqModel = bandModel.HQ;
            BandHQ? newBandHQ = null;
            if (hqModel is not null)
                newBandHQ = new()
                {
                    BandId = bandId,
                    Country = hqModel.Country,
                    City = hqModel.City,
                    Street = hqModel.Street,
                    SquareMeters = hqModel.SquareMeters
                };

            bandsRepository.CreateBand(newBand, newBandHQ);
            profilesRepository.UpdateBandId(userId, bandId);
            profilesRepository.UpdateUserInvitations(userId, null);

            return bandId;
        }


        public bool UpdateMusicalBand(MusicalBandModel bandModel)
        {
            MusicalBand? band = bandsRepository.GetBandById(bandModel.BandId);
            if (band is not null)
            {
                band.Name = bandModel.Name;
                band.MusicGenre = bandModel.MusicGenre;
                band.IsComplete = bandModel.IsComplete;

                BandHqModel? hqModel = bandModel.HQ;
                BandHQ? bandHQ = band.HQ;
                if (hqModel is not null)
                {
                    if (bandHQ is not null)
                    {
                        bandHQ.Country = hqModel.Country;
                        bandHQ.City = hqModel.City;
                        bandHQ.Street = hqModel.Street;
                        bandHQ.SquareMeters = hqModel.SquareMeters;
                    }
                    else
                    {
                        BandHQ newBandHQ = new()
                        {
                            BandId = bandModel.BandId,
                            Country = hqModel.Country,
                            City = hqModel.City,
                            Street = hqModel.Street,
                            SquareMeters = hqModel.SquareMeters
                        };
                        bandsRepository.CreateBandHQ(newBandHQ);
                    }
                }
                else bandHQ = null;

                bandsRepository.UpdateBand(band, bandHQ);
                return true;
            }
            return false;
        }


        public void DeleteMusicalBand(string bandId)
        {
            var band = bandsRepository.GetBandWithMembers(bandId);

            if (band is not null)
            {
                foreach (UserProfile memberProfile in band.Members.ToList())
                    profilesRepository.UpdateBandId(memberProfile.Owner.Id, null);

                bandsRepository.DeleteBand(band);
            }
        }



        public void SaveBandUserMatches(BandUserMatchModel[] models)
        {
            List<BandUserMatch> newMatches = new();
            foreach (BandUserMatchModel model in models)
            {
                var newMatch = new BandUserMatch
                {
                    BandId = model.BandId,
                    UserId = model.UserId,
                    MatchType = model.MatchType
                };
                newMatches.Add(newMatch);
            }
            bandsRepository.AddBandUserMatches(newMatches);
        }


        public List<SurveyResultModel> GetBandMatches(string bandId)
        {
            List<SurveyResultModel> userProfiles = new();
            List<BandUserMatch> matches = bandsRepository.GetBandMatchedProfiles(bandId).ToList();
            foreach (var match in matches)
            {
                UserProfile profile = match.UserProfile;

                UserAddressModel address = new()
                {
                    Country = profile.Address.Country,
                    City = profile.Address.City,
                    Street = profile.Address.Street
                };

                UserProfileModel profileModel = new()
                {
                    Username = profile.Owner.UserName,
                    Email = profile.Owner.Email,
                    PhoneNumber = profile.Owner.PhoneNumber,
                    Address = address,
                    FirstName = profile.FirstName,
                    LastName = profile.LastName,
                    Age = profile.Age,
                    Occupation = profile.Occupation,
                    Trait1 = profile.Trait1,
                    Trait2 = profile.Trait2,
                    CanSing = profile.CanSing,
                    PlayedInstrument = profile.PlayedInstrument,
                    PreferredMusicGenre = profile.PreferredMusicGenre,
                };

                SurveyResultModel matchedUser = new()
                {
                    MatchedUserId = profile.UserId,
                    MatchedUserProfile = profileModel,
                    MatchType = match.MatchType
                };
                userProfiles.Add(matchedUser);
            }
            return userProfiles;
        }


        public void UpdateBandUserMatch(BandUserMatchModel model)
        {
            BandUserMatch? match = bandsRepository.GetMatchToUpdate(model.BandId, model.UserId);
            if (match is not null)
            {
                match.MatchType = model.MatchType;
                bandsRepository.UpdateBandUserMatch(match);
            }
        }


        public void DeleteBandMatches(string bandId)
        {
            bandsRepository.RemoveBandMatches(bandId);
        }

    }
}
