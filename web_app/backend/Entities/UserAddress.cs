using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Entities
{
    public class UserAddress
    {
        [Key]
        public string UserId { get; set; } = null!; // also foreign key
        [JsonIgnore]
        public virtual UserProfile Profile { get; set; } = null!;

        public string Country { get; set; } = null!;
        public string City { get; set; } = null!;
        public string? Street { get; set; }
    }
}
