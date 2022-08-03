namespace backend.Models
{
    public class TokenModel
    {
        public string AccessToken { get; set; } = null!;
        public DateTime AccessTokenExpiryDate { get; set; }
        public string RefreshToken { get; set; } = null!;
    }
}
