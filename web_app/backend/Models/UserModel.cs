using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class UserModel
    {
        public string UserId { get; set; } = "";

        [Required, StringLength(50, MinimumLength = 2)]
        public string Username { get; set; } = null!;

        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        public string? Password { get; set; }
    }
}
