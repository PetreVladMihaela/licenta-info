using backend.Entities;
using backend.Models;

namespace backend.Managers
{
    public interface IUsersManager
    {
        List<User> GetAllUsers();
        //User GetUserById(string id);
        Task<UserModel?> GetUserByUsernameAsync(string username);

        //void Create(UserModel model);
        User? Update(UserModel model);
        void Delete(string id);
    }
}
