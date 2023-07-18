using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace backend.Entities
{
    // Required Nuget Packages:
    /*   EntityFrameworkCore -> the ORM
     *   EntityFrameworkCore.Relational
     *   EntityFrameworkCore.SqlServer -> SqlServer provider
     *   EntityFrameworkCore.Tools
     */

    // Steps to create the db:
    /*   1. Add-Migration InitialCreate -> Package Manager Console
     *   2. Check migration
     *   3. Everything ok => Update-Database
     */
    public class DatabaseContext : IdentityDbContext<User, IdentityRole, string, IdentityUserClaim<string>,
        IdentityUserRole<string>, IdentityUserLogin<string>, IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        //public DbSet<User> Users { get; set; };

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder
        //        .UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Initial Catalog=backend;Integrated Security=True;Connect Timeout=30;Encrypt=True;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
        //}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}