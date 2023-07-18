using backend.Entities;
using backend.Models;

namespace backend.Managers
{
    public interface IUsersManager
    {
        List<User> GetAllUsers();

        Task<UserModel?> GetUserByUsernameAsync(string username);
        Task<(User?, bool)> UpdateUserAsync(string whatToUpdate, string newValue, string username);

        void Delete(string userId);
    }
}
