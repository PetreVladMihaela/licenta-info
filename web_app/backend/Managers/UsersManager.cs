using backend.Repositories;
using backend.Entities;
using backend.Models;


namespace backend.Managers
{
    public class UsersManager : IUsersManager
    {
        private readonly IUsersRepository usersRepository;

        public UsersManager(IUsersRepository usersRepository)
        {
            this.usersRepository = usersRepository;
        }


        public List<User> GetAllUsers()
        {
            return usersRepository.GetUsersIQueryable().ToList();
        }


        public User GetUserById(string id)
        {
            var user = usersRepository.GetUsersIQueryable().First(u => u.Id == id);
            return user;
        }


        public void Delete(string id)
        {
            var user = GetUserById(id);
            if (user is not null)
                usersRepository.Delete(user);
        }


        public UserModel? GetUserByUsername(string username)
        {
            var userData = usersRepository.GetUsersIQueryable().FirstOrDefault(u => u.UserName == username);
            UserModel? user = null;
            if (userData is not null)
            {
                user = new UserModel
                {
                    UserId = userData.Id,
                    Username = userData.UserName,
                    Email = userData.Email,
                    Password = userData.PasswordHash
                    //Password = Aes256Encryption.DecryptData(userData.EncryptedPassword)
                };
            }
            return user;
        }


        public void Update(UserModel model)
        {
            //string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);
            var user = GetUserById(model.UserId);
            user.UserName = model.Username;
            user.Email = model.Email;
            //user.EncryptedPassword = Aes256Encryption.EncryptData(hashedPassword);
            usersRepository.Update(user);
        }


        public void Create(UserModel model)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);
            //Console.WriteLine($"\nhashed password: {hashedPassword}\n");
            //string cipherText = Aes256Encryption.EncryptData(hashedPassword);
            var newUser = new User
            {
                UserName = model.Username,
                Email = model.Email,
                PasswordHash = hashedPassword
                //EncryptedPassword = cipherText
            };
            usersRepository.Create(newUser);
        }

    }
}
