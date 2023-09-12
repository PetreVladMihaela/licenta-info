using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ResetPasswordModel
    {
        [EmailAddress]
        public string Email { get; set; } = null!;
        public string Token { get; set; } = null!;
        public string TokenExpirationTime { get; set; } = null!;

        [StringLength(25, MinimumLength = 6)]
        public string Password { get; set; } = null!;

        [Compare("Password", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; } = null!;
    }


    public class ResetPasswordErrorModel
    {
        public string ErrorMessage { get; set; } = null!;
        public bool FormError { get; set; }
        public List<string> FormErrors { get; set; } = new();

        [EmailAddress]
        public string Email { get; set; } = null!;
        public string Token { get; set; } = null!;
        public string ExpirationTime { get; set; } = null!;
    }
}
