using backend.Repositories;
using backend.Entities;
using backend.Models;
using Microsoft.AspNetCore.Identity;


namespace backend.Managers
{
    public class UsersManager : IUsersManager
    {
        private readonly IUsersRepository usersRepository;
        private readonly UserManager<User> userManager;
        private readonly IProfilesManager profilesManager;

        public UsersManager(UserManager<User> userManager, IUsersRepository usersRepository, IProfilesManager profilesManager)
        {
            this.usersRepository = usersRepository; 
            this.userManager = userManager;
            this.profilesManager = profilesManager;
        }


        public List<User> GetAllUsers()
        {
            return usersRepository.GetUsersIQueryable().ToList();
        }


        public async Task<UserModel?> GetUserByUsernameAsync(string username)
        {
            UserModel? userModel = null;

            //User? user = usersRepository.GetUsersIQueryable().FirstOrDefault(u => u.UserName == username);
            User? user = await userManager.FindByNameAsync(username);
            if (user is not null)
            {
                IList<string> userRoles = await userManager.GetRolesAsync(user);

                userModel = new UserModel
                {
                    UserId = user.Id,
                    Username = user.UserName,
                    Email = user.Email,
                    UserRoles = userRoles
                };

                UserProfileModel? profileModel = profilesManager.GetProfileByUsername(username);
                if (profileModel is not null)
                    profileModel.CanBeEdited = true;
                userModel.Profile = profileModel;
            }
            return userModel;
        }


        public async Task<(User?, bool)> UpdateUserAsync(string whatToUpdate, string newValue, string username)
        {
            bool updated = false;
            User? user = await userManager.FindByNameAsync(username);
            if (user is not null)
            {
                if (whatToUpdate == "Username")
                    user.UserName = newValue;
                else if (whatToUpdate == "Email")
                    user.Email = newValue;
                
                IdentityResult result = await userManager.UpdateAsync(user);
                if (result.Succeeded)
                    updated = true;
            }
            return (user, updated);
        }


        private User? GetUserById(string id)
        {
            return usersRepository.GetUsersIQueryable().FirstOrDefault(u => u.Id == id);
        }


        public void Delete(string id)
        {
            var user = GetUserById(id);
            if (user is not null) 
                userManager.DeleteAsync(user);
        }


        //public void Create(UserModel model)
        //{
        //    //string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);
        //    string cipherText = Aes256Encryption.EncryptData(model.Password);
        //    var newUser = new User
        //    {
        //        UserName = model.Username,
        //        Email = model.Email,
        //        EncryptedPassword = cipherText
        //    };
        //    usersRepository.Create(newUser);
        //}

    }
}
