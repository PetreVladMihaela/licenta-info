using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class LoginUserModel
    {
        [Required(ErrorMessage = "A user identifier (email or username) is required!"), StringLength(30, MinimumLength = 2)]
        public string UserIdentifier { get; set; } = null!;

        public bool EmailLogin { get; set; }

        [Required(ErrorMessage = "A password is required!"), StringLength(25, MinimumLength = 6)]
        public string Password { get; set; } = null!;
    }
}
