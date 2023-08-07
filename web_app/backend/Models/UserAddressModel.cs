using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class UserAddressModel
    {
        //[Required]
        //public string UserId { get; set; } = null!;

        [Required]
        public string Country { get; set; } = "-";
        [Required]
        public string City { get; set; } = "-";

        public string? Street { get; set; }
    }
}
