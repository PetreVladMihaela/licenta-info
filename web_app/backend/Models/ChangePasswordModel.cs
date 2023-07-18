using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ChangePasswordModel
    {
        [Required, StringLength(30, MinimumLength = 2)]
        public string Username { get; set; } = null!;

        [Required, StringLength(25, MinimumLength = 6)]
        public string OldPassword { get; set; } = null!;

        [Required, StringLength(25, MinimumLength = 6)]
        public string NewPassword { get; set; } = null!;
    }
}
