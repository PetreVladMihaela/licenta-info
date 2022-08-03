using backend.Models;
using backend.Entities;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;


namespace backend.Managers
{
    public interface ITokensManager
    {
        public Task<TokenModel> GenerateToken(User user);
        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        public string GenerateRefreshToken();
        public TokenModel CreateNewToken(List<Claim> authClaims);
    }
}
