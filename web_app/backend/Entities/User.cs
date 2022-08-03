using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
//using EntityFrameworkCore.EncryptColumn.Attribute;


namespace backend.Entities
{
    [Index(nameof(Email), IsUnique = true)]
    //[Index(nameof(Username), IsUnique = true)]
    public class User : IdentityUser
    {
        //[Required, Key]
        //public Guid UserId { get; set; }

        [Required/*, StringLength(50, MinimumLength = 2)*/]
        override public string UserName { get; set; } = null!; //must be unique

        [Required, EmailAddress]
        override public string Email { get; set; } = null!; //must be unique

        [Required]
        override public string PasswordHash { get; set; } = null!;

        //[Required, StringLength(250)]
        //public string EncryptedPassword { get; set; } = null!;

        //[Required, StringLength(30)]
        //public string Role { get; set; } = "BasicUser";

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryDate { get; set; }
    }
}
