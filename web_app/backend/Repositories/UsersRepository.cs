﻿using backend.Entities;

namespace backend.Repositories
{
    public class UsersRepository : IUsersRepository
    {
        private readonly DatabaseContext db;

        public UsersRepository(DatabaseContext db)
        {
            this.db = db;
        }

        public IQueryable<User> GetUsersIQueryable()
        {
            return db.Users;
        }

        //public void Create(User user)
        //{
        //    db.Users.Add(user);
        //    db.SaveChanges();
        //}

        //public void Delete(User user)
        //{
        //    db.Users.Remove(user);
        //    db.SaveChanges();
        //}
    }
}
