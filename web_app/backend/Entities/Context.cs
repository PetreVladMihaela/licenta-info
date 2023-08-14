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
        public DbSet<UserProfile> UserProfiles { get; set; } = null!;
        public DbSet<UserAddress> UserAddresses { get; set; } = null!;
        public DbSet<MusicalBand> MusicalBands { get; set; } = null!;
        public DbSet<BandHQ> BandHeadquarters { get; set; } = null!;
        public DbSet<BandUserMatch> BandUserMatches { get; set; } = null!;

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder
        //        .UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Initial Catalog=backend;Integrated Security=True;Connect Timeout=30;Encrypt=True;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
        //}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //One to One
            builder.Entity<UserProfile>()
                .HasOne(profile => profile.Owner)
                .WithOne(user => user.Profile)
                .HasForeignKey<UserProfile>() // PK-to-PK relationship
                .IsRequired();

            //One to One
            builder.Entity<UserProfile>()
                .HasOne(profile => profile.Address)
                .WithOne(address => address.Profile)
                .HasForeignKey<UserAddress>() // PK-to-PK relationship
                .IsRequired();

            //One to One
            builder.Entity<MusicalBand>()
                .HasOne(band => band.HQ)
                .WithOne(hq => hq.Band)
                .HasForeignKey<BandHQ>(); // PK-to-PK relationship

            //One to Many
            builder.Entity<MusicalBand>()
                .HasMany(band => band.Members)
                .WithOne(member => member.Band)
                .HasForeignKey(member => member.BandId);


            //Many To Many
            builder.Entity<BandUserMatch>().HasKey(match => new { match.BandId, match.UserId });

            builder.Entity<BandUserMatch>()
                .HasOne(match => match.MusicalBand)
                .WithMany(band => band.Matches)
                .HasForeignKey(match => match.BandId);

            builder.Entity<BandUserMatch>()
                .HasOne(match => match.UserProfile)
                .WithMany(profile => profile.Matches)
                .HasForeignKey(match => match.UserId);
        }
    }
}