using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class UserModel
    {
        public string UserId { get; set; } = "";

        [Required]
        public string Username { get; set; } = null!;

        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        public string? HashedPassword { get; set; }

        public IList<string>? UserRoles { get; set; }
    }
}
