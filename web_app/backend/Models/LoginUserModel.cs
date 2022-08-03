using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class LoginUserModel
    {
        [Required(ErrorMessage = "Username is required!")]
        public string Username { get; set; } = null!;

        [Required(ErrorMessage = "Password is required!")]
        public string Password { get; set; } = null!;
    }
}
