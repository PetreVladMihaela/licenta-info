using backend.Entities;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Cryptography;


namespace backend.Managers
{
    public class TokensManager : ITokensManager
    {
        private readonly UserManager<User> userManager;
        private readonly IConfiguration configuration;

        public TokensManager(UserManager<User> userManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.configuration = configuration;
        }


        public async Task<TokenModel> GenerateToken(User user)
        {
            List<Claim> authClaims = new()
            {   
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),//JWT ID
            };

            var userRoles = await userManager.GetRolesAsync(user);
            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }
                
            TokenModel token = CreateNewToken(authClaims);

            bool parseResult = int.TryParse(configuration["JWT:RefreshTokenValidityInDays"], out int validityInDays);
            if (parseResult is false)
                validityInDays = 2;

            user.RefreshToken = token.RefreshToken;
            user.RefreshTokenExpiryDate = DateTime.Now.AddDays(validityInDays).ToUniversalTime();
            await userManager.UpdateAsync(user);

            return token;
        }


        public TokenModel CreateNewToken(List<Claim> authClaims)
        {
            //var secretKey = configuration.GetSection("Jwt").GetSection("SecretKey").Get<string>();
            //var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:SecretKey"]));
            var authCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256);//HmacSha256Signature
            
            var parseResult = int.TryParse(configuration["JWT:AccessTokenValidityInMinutes"], out int validityInMinutes);
            if (parseResult is false)
                validityInMinutes = 15;

            JwtSecurityTokenHandler tokenHandler = new();

            //var tokenDescriptor = new SecurityTokenDescriptor
            //{
            //    Subject = new ClaimsIdentity(authClaims),
            //    Expires = DateTime.UtcNow.AddMinutes(validityInMinutes),
            //    SigningCredentials = authCredentials
            //};
            //var token = tokenHandler.CreateToken(tokenDescriptor);

            JwtSecurityToken token = new(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(validityInMinutes).ToUniversalTime(),
                claims: authClaims,
                signingCredentials: authCredentials
                );

            string refreshToken = GenerateRefreshToken();

            TokenModel newToken = new()
            {
                AccessToken = tokenHandler.WriteToken(token),
                AccessTokenExpiryDate = token.ValidTo,
                RefreshToken = refreshToken,
            };

            return newToken;
        }


        private static string GenerateRefreshToken()
        {
            byte[] randomNumber = new byte[64];
            using RandomNumberGenerator rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }


        public ClaimsPrincipal? GetPrincipalFromToken(string token)
        {
            byte[] secretKey = Encoding.UTF8.GetBytes(configuration["JWT:SecretKey"]);
            TokenValidationParameters validationParameters = new()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidAudience = configuration["JWT:ValidAudience"],
                ValidIssuer = configuration["JWT:ValidIssuer"],
                ValidateLifetime = false, //we don't care about the token's expiration date
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(secretKey),
                ClockSkew = TimeSpan.Zero
            };

            JwtSecurityTokenHandler tokenHandler = new();
            try
            {
                var claimsPrincipal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken securityToken);

                if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                    jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.Ordinal) is false)

                    throw new SecurityTokenException("Invalid Security Token");

                return claimsPrincipal;
            } 
            catch (SecurityTokenException)
            {
                return null;
            }              
        }

    }
}
