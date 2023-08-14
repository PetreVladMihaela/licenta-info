using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class BandUserMatchModel
    {
        [Required]
        public string BandId { get; set; } = null!;
        [Required]
        public string UserId { get; set; } = null!;
        [Required]
        public string MatchType { get; set; } = null!;
    }

    public class SurveyResultModel
    {
        [Required]
        public string MatchedUserId { get; set; } = null!;
        [Required]
        public UserProfileModel MatchedUserProfile { get; set; } = null!;
        [Required]
        public string MatchType { get; set; } = null!;
    }

    public class InvitationModel
    {
        [Required]
        public string InvitedUserId { get; set; } = null!;
        [Required]
        public string BandToJoinId { get; set; } = null!;
        [Required]
        public string BandToJoinName { get; set; } = null!;
    }
}