using backend.Models;
using backend.Entities;
using System.Security.Claims;


namespace backend.Managers
{
    public interface ITokensManager
    {
        public Task<TokenModel> GenerateToken(User user);
        public TokenModel CreateNewToken(List<Claim> authClaims);
        public ClaimsPrincipal? GetPrincipalFromToken(string token);
    }
}
