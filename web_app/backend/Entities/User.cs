using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;


namespace backend.Entities
{
    [Index(nameof(NormalizedEmail), IsUnique = true)]
    //[Index(nameof(Email), IsUnique = true)]
    //[Index(nameof(UserName), IsUnique = true)]
    public class User : IdentityUser
    {
        //[Required, Key]
        //public Guid UserId { get; set; }

        [JsonIgnore]
        public virtual UserProfile? Profile { get; set; }

        [Required]
        override public string UserName { get; set; } = null!;
        [Required]
        override public string NormalizedUserName { get; set; } = null!; // is unique by default

        [Required]
        override public string Email { get; set; } = null!; 
        [Required]
        override public string NormalizedEmail { get; set; } = null!; // must be unique

        [Required]
        override public string PasswordHash { get; set; } = null!;

        //[Required, StringLength(250)]
        //public string EncryptedPassword { get; set; } = null!;

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryDate { get; set; }

        //public virtual ICollection<UserRole>? UserRoles { get; set; }
    }
}
