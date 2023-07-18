using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class UserModel
    {
        //public string UserId { get; set; } = "";
        //public string? Password { get; set; }

        [Required, StringLength(30, MinimumLength = 2)]
        public string Username { get; set; } = null!;

        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        public IList<string> UserRoles { get; set; } = new List<string>();
    }
}
