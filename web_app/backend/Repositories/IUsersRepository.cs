using backend.Entities;

namespace backend.Repositories
{
    public interface IUsersRepository
    {
        IQueryable<User> GetUsersIQueryable();

        //void Create(User user);
        //void Delete(User user);
    }
}
