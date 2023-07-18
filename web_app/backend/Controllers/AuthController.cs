using backend.Entities;
using backend.Managers;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly SignInManager<User> signInManager;
        private readonly ITokensManager tokensManager;
        private readonly IConfiguration configuration;

        public AuthenticationController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, 
            SignInManager<User> signInManager, ITokensManager tokensManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.signInManager = signInManager;
            this.tokensManager = tokensManager;
            this.configuration = configuration;
        }


        //[Authorize("MinAge")]
        [HttpPost("registerUser")]
        public async Task<IActionResult> Register([FromBody] RegisterUserModel signupModel)
        {
            var user = await userManager.FindByNameAsync(signupModel.Username);
            if (user is not null)
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = 500,
                    Title = "Internal Server Error", Message = "The username already exists." });

            //string hashedPassword = BCrypt.Net.BCrypt.HashPassword(signupModel.Password);
            User newUser = new()
            {
                UserName = signupModel.Username,
                Email = signupModel.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                //EncryptedPassword = Aes256Encryption.EncryptData(hashedPassword)
            };

            IdentityResult result = await userManager.CreateAsync(newUser, signupModel.Password);
            if (result.Succeeded is false)
            {
                bool invalidUsername = result.Errors.Any(error => error.Code == "InvalidUserName");
                bool invalidPassword = result.Errors.Any(error => error.Code.StartsWith("PasswordRequires"));
                bool duplicateEmail = result.Errors.Any(error => error.Code == "DuplicateEmail");

                string errorMessage = "User creation failed.";
                if (invalidUsername)
                    errorMessage += " The chosen username is invalid.";
                if (invalidPassword)
                    errorMessage += " The given password is invalid.";
                if (duplicateEmail)
                    errorMessage += " An account with this email already exists.";

                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = 500, 
                    Title = "Internal Server Error", Message = errorMessage });
            }

            if (await roleManager.RoleExistsAsync(signupModel.Role) is false)
                await roleManager.CreateAsync(new IdentityRole(signupModel.Role));

            await userManager.AddToRoleAsync(newUser, signupModel.Role);

            return Ok(new { Status = 200, Title = "Success", Message = "User created successfully!" });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserModel loginModel)
        {
            var user = await userManager.FindByNameAsync(loginModel.Username);
            if (user is not null)
            {
                //var check await userManager.CheckPasswordAsync(user, loginModel.Password)
                var check = await signInManager.CheckPasswordSignInAsync(user, loginModel.Password, true); //lockoutOnFailure:true
                if (check.Succeeded)
                {
                    TokenModel token = await tokensManager.GenerateToken(user);

                    //Response.Headers["Access-Control-Allow-Credentials"] = "true";
                    Response.Cookies.Append("User_Access_Token", token.AccessToken, 
                        new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.None, Secure = true } );

                    Response.Cookies.Append("Token_Expiry_Date", token.AccessTokenExpiryDate.ToString("s"),//Sortable date/time
                        new CookieOptions() { HttpOnly = false, SameSite = SameSiteMode.None, Secure = true, Expires = token.AccessTokenExpiryDate } );

                    Response.Cookies.Append("User_Refresh_Token", token.RefreshToken,                       //expiration date and time is in UTC
                        new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.None, Secure = true, Expires = user.RefreshTokenExpiryDate } );

                    return Ok(); //return Ok(token);
                }
                else if (check.IsLockedOut)
                {
                    return Unauthorized(new { Status = 401, Title = "Unauthorized", Message = "The account is locked!", user.LockoutEnd });
                }
                else if (check == Microsoft.AspNetCore.Identity.SignInResult.Failed)
                {
                    return Unauthorized(new { Status = 401, Title = "Unauthorized", Message = "The password is incorrect!" });
                }
                else return Unauthorized();
            }
            return Unauthorized(new { Status = 401, Title = "Unauthorized", Message = "The username was not found!" });
        }


        [HttpGet("logout")]
        public async Task<IActionResult> LogoutAsync()
        {
            var username = User.Identity?.Name;
            if (username is not null)
            {
                var user = await userManager.FindByNameAsync(username);
                user.RefreshToken = null;
                user.RefreshTokenExpiryDate = null;
                await userManager.UpdateAsync(user);
            }
                
            Response.Cookies.Delete("User_Access_Token", new CookieOptions(){ SameSite = SameSiteMode.None, Secure = true });
            Response.Cookies.Delete("Token_Expiry_Date", new CookieOptions() { SameSite = SameSiteMode.None, Secure = true });
            Response.Cookies.Delete("User_Refresh_Token", new CookieOptions() { SameSite = SameSiteMode.None, Secure = true });

            return Ok();
        }


        [HttpGet("refreshToken")]
        public async Task<IActionResult> RefreshToken()
        { 
            string? accessToken = Request.Cookies["User_Access_Token"];
            if (accessToken is null)
                return BadRequest(new { Status = 400, Title = "Bad Request", Message = "No access token was found." });

            string? refreshToken = Request.Cookies["User_Refresh_Token"];
            if (refreshToken is null)
                return BadRequest(new { Status = 400, Title = "Bad Request", Message = "No refresh token was found." });

            var claimsPrincipal = tokensManager.GetPrincipalFromToken(accessToken);
            if (claimsPrincipal is null || claimsPrincipal.Identity is null)
                return BadRequest(new { Status = 400, Title = "Bad Request", Message = "The access token is invalid." });

            string? username = claimsPrincipal.Identity.Name;
            User? user = null;
            if (username is not null)
                user = await userManager.FindByNameAsync(username);

            if (user is null)
                return NotFound(new { Status = 404, Title = "Not Found", Message = "The user was not found." });


            string? userRefreshToken = user.RefreshToken;
            if (userRefreshToken != refreshToken || user.RefreshTokenExpiryDate < DateTime.Now.ToUniversalTime())
                return BadRequest(new { Status = 400, Title = "Bad Request", Message = "The refresh token is invalid." });

            TokenModel newToken = tokensManager.CreateNewToken(claimsPrincipal.Claims.ToList());

            bool parseResult = int.TryParse(configuration["JWT:RefreshTokenValidityInDays"], out int validityInDays);
            if (parseResult is false)
                validityInDays = 2;

            user.RefreshToken = newToken.RefreshToken;
            user.RefreshTokenExpiryDate = DateTime.Now.AddDays(validityInDays).ToUniversalTime();
            await userManager.UpdateAsync(user);

            Response.Cookies.Append("User_Access_Token", newToken.AccessToken, 
                new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.None, Secure = true });

            Response.Cookies.Append("Token_Expiry_Date", newToken.AccessTokenExpiryDate.ToString("s"), 
                new CookieOptions() { HttpOnly = false, SameSite = SameSiteMode.None, Secure = true, Expires = newToken.AccessTokenExpiryDate });

            Response.Cookies.Append("User_Refresh_Token", newToken.RefreshToken, 
                new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.None, Secure = true, Expires = user.RefreshTokenExpiryDate });

            return Ok();
        }


        [HttpGet("checkUsername/{username}")]
        public async Task<IActionResult> CheckIfUsernameExists([FromRoute] string username)
        {
            var user = await userManager.FindByNameAsync(username);
            if (user is null)
                return Ok(new { UsernameExists = false });
            else
                return Ok(new { UsernameExists = true });
        }

    }
}
