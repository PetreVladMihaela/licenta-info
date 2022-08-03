using backend.Entities;
using backend.Models;

namespace backend.Managers
{
    public interface IUsersManager
    {
        List<User> GetAllUsers();
        User GetUserById(string id);
        UserModel? GetUserByUsername(string username);

        void Create(UserModel model);
        void Update(UserModel model);
        void Delete(string id);
    }
}
