using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class RegisterUserModel
    {
        [Required(ErrorMessage = "Username is required!"), StringLength(30, MinimumLength = 2)]
        public string Username { get; set; } = null!;

        [EmailAddress, Required(ErrorMessage = "Email is required!")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Password is required!"), StringLength(25, MinimumLength = 6)]
        public string Password { get; set; } = null!;

        [Required]
        public string Role { get; set; } = "BasicUser";
    }
}
