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

        public UsersManager(UserManager<User> userManager, IUsersRepository usersRepository)
        {
            this.usersRepository = usersRepository; 
            this.userManager = userManager;
        }


        public List<User> GetAllUsers()
        {
            return usersRepository.GetUsersIQueryable().ToList();
        }


        public async Task<UserModel?> GetUserByUsernameAsync(string username)
        {
            UserModel? userModel = null;
            var userData = usersRepository.GetUsersIQueryable().FirstOrDefault(u => u.UserName == username);
            if (userData is not null)
            {
                var user = GetUserById(userData.Id);
                IList<string> userRoles = new List<string>();
                if (user is not null)
                  userRoles = await userManager.GetRolesAsync(user);

                userModel = new UserModel
                {
                    UserId = userData.Id,
                    Username = userData.UserName,
                    Email = userData.Email,
                    HashedPassword = userData.PasswordHash,
                    UserRoles = userRoles
                    //Password = Aes256Encryption.DecryptData(userData.EncryptedPassword)
                };
            }
            return userModel;
        }


        private User? GetUserById(string id)
        {
            var user = usersRepository.GetUsersIQueryable().FirstOrDefault(u => u.Id == id);
            return user;
        }


        public User? Update(UserModel model)
        {
            //string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);
            var user = GetUserById(model.UserId);
            if (user is not null)
            {
                user.UserName = model.Username;
                user.Email = model.Email;
                //user.EncryptedPassword = Aes256Encryption.EncryptData(hashedPassword);
                usersRepository.Update(user);
            }
            return user;
        }


        public void Delete(string id)
        {
            var user = GetUserById(id);
            if (user is not null)
                usersRepository.Delete(user);
        }


        //public void Create(UserModel model)
        //{
        //    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);
        //    //Console.WriteLine($"\nhashed password: {hashedPassword}\n");
        //    //string cipherText = Aes256Encryption.EncryptData(hashedPassword);
        //    var newUser = new User
        //    {
        //        UserName = model.Username,
        //        Email = model.Email,
        //        PasswordHash = hashedPassword
        //        //EncryptedPassword = cipherText
        //    };
        //    usersRepository.Create(newUser);
        //}

    }
}
