using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class RegisterUserModel
    {
        [EmailAddress, Required] //default required error message: "The Email field is required."
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "A username is required!"), StringLength(30, MinimumLength = 2)]
        public string Username { get; set; } = null!;

        [Required(ErrorMessage = "A password is required!"), StringLength(25, MinimumLength = 6)]
        public string Password { get; set; } = null!;

        [Required]
        public string Role { get; set; } = "Basic User";
    }
}
