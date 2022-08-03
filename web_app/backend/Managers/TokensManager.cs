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
            var userRoles = await userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    //new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var token = CreateNewToken(authClaims);

            //_ = int.TryParse(configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);
            user.RefreshToken = token.RefreshToken;
            user.RefreshTokenExpiryDate = DateTime.Now.AddDays(2);
            await userManager.UpdateAsync(user);

            return token;
        }


        public TokenModel CreateNewToken(List<Claim> authClaims)
        {
            //var secretKey = configuration.GetSection("Jwt").GetSection("SecretKey").Get<string>();
            //var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:SecretKey"]));
            var authCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256);//HmacSha256Signature

            //var tokenDescriptor = new SecurityTokenDescriptor
            //{
            //    Subject = new ClaimsIdentity(authClaims),
            //    Expires = DateTime.Now.AddDays(1), //Expires = DateTime.UtcNow.AddMinutes(10),
            //    SigningCredentials = authCredentials
            //};
            //var tokenHandler = new JwtSecurityTokenHandler();
            //var token = tokenHandler.CreateToken(tokenDescriptor);
            //return new TokenModel { token = tokenHandler.WriteToken(token) };

            var token = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(10),
                claims: authClaims,
                signingCredentials: authCredentials
                );

            var refreshToken = GenerateRefreshToken();

            TokenModel newToken = new()
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                AccessTokenExpiryDate = token.ValidTo,
                RefreshToken = refreshToken,
            };

            return newToken;
        }


        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }


        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var secretKey = Encoding.UTF8.GetBytes(configuration["JWT:SecretKey"]);
            var tokenValidationParameters = new TokenValidationParameters
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

            var tokenHandler = new JwtSecurityTokenHandler();
            var claimsPrincipal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid Token");
            }
            return claimsPrincipal;
        }

    }
}
