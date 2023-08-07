using backend.Repositories;
using backend.Entities;
using backend.Models;


namespace backend.Managers
{
    public class ProfilesManager : IProfilesManager
    {
        private readonly IProfilesRepository profilesRepository;

        public ProfilesManager(IProfilesRepository profilesRepository)
        {
            this.profilesRepository = profilesRepository;
        }

        public List<UserProfile> GetUserProfiles()
        {
            return profilesRepository.GetProfilesIQueryable().ToList();
        }

        
        public UserProfileModel? GetProfileByUsername(string username)
        {
            UserProfile? profile = profilesRepository.GetProfileByOwnerUsername(username);

            if (profile is null)
                return null;

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
                BandId = profile.BandId,
                BandName = profile.Band?.Name
            };

            return profileModel;
        }


        public void CreateUserProfile(UserProfileModel profileModel, string userId)
        {
            UserProfile newProfile = new()
            {
                UserId = userId,
                FirstName = profileModel.FirstName,
                LastName = profileModel.LastName,
                Age = profileModel.Age,
                Occupation = profileModel.Occupation,
                Trait1 = profileModel.Trait1,
                Trait2 = profileModel.Trait2,
                CanSing = profileModel.CanSing,
                PlayedInstrument = profileModel.PlayedInstrument,
                PreferredMusicGenre = profileModel.PreferredMusicGenre
            };

            UserAddressModel addressModel = profileModel.Address;
            UserAddress newAddress = new()
            {
                UserId = userId,
                Country = addressModel.Country,
                City = addressModel.City,
                Street = addressModel.Street
            };

            profilesRepository.CreateProfile(newProfile, newAddress);
        }


        public void UpdateUserProfile(UserProfileModel model)
        {
            UserProfile? profile = profilesRepository.GetProfileByOwnerUsername(model.Username);
            if (profile is not null)
            {
                profile.FirstName = model.FirstName;
                profile.LastName = model.LastName;
                profile.Age = model.Age;
                profile.Occupation = model.Occupation;
                profile.Trait1 = model.Trait1;
                profile.Trait2 = model.Trait2;
                profile.CanSing = model.CanSing;
                profile.PlayedInstrument = model.PlayedInstrument;
                profile.PreferredMusicGenre = model.PreferredMusicGenre;

                UserAddress address = profile.Address;
                address.Country = model.Address.Country;
                address.City = model.Address.City;
                address.Street = model.Address.Street;

                profilesRepository.UpdateProfile(profile, address);
            }
        }


        public void DeleteUserProfile(string username)
        {
            profilesRepository.DeleteProfile(username);
        }
    }
}
