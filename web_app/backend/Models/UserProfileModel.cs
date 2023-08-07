using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class UserProfileModel
    {
        //[Required]
        //public string UserId { get; set; } = null!;

        public bool CanBeEdited { get; set; }

        [Required, StringLength(30, MinimumLength = 2)]
        public string Username { get; set; } = null!;

        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [StringLength(20, MinimumLength = 10)]
        public string? PhoneNumber { get; set; }

        public UserAddressModel Address { get; set; } = new();

        public string? BandId { get; set; }
        public string? BandName { get; set; }

        [Required]
        public string FirstName { get; set; } = null!;
        [Required]
        public string LastName { get; set; } = null!;

        public byte Age { get; set; }
        public string? Occupation { get; set; }

        public bool CanSing { get; set; }
        public string? PlayedInstrument { get; set; }
        public string? PreferredMusicGenre { get; set; }

        public string? Trait1 { get; set; }
        public string? Trait2 { get; set; }
    }
}
