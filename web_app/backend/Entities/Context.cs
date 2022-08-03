using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace backend.Entities
{
    //Required Nuget Packages
    /*   
      EntityFrameworkCore, care este ORM-ul in sine 
      EntityFrameworkCore.Relational 
      EntityFrameworkCore.SqlServer, care este provider-ul spre SqlServer(baza de date pe care o vom folosi)
      EntityFrameworkCore.Tools
    */

    //1. Add-Migration InitialCreate -> Package Manager Console
    //2. Verificati migration-ul 
    //3. Daca totul e ok, => Update-Database
    public class DatabaseContext : IdentityDbContext<User, IdentityRole, string, IdentityUserClaim<string>,
        IdentityUserRole<string>, IdentityUserLogin<string>, IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        //public DbSet<User> Users { get; set; };

        //public virtual DbSet<UserRefreshTokens> UserRefreshToken { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder
        //        //.UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()))
        //        .UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Initial Catalog=backend;Integrated Security=True;Connect Timeout=30;Encrypt=True;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
        //}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}