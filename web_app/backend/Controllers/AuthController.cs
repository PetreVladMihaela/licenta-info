using backend.Entities;
using backend.Managers;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


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

        public AuthenticationController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, SignInManager<User> signInManager, ITokensManager tokensManager)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.signInManager = signInManager;
            this.tokensManager = tokensManager;
        }

        //[Authorize("MinAge")]
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserModel signupModel)
        {
            var user = await userManager.FindByNameAsync(signupModel.Username);
            if (user is not null)
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = 500, Title = "Internal Server Error", Message = "The username already exists!" });

            //string hashedPassword = BCrypt.Net.BCrypt.HashPassword(signupModel.Password);
            User newUser = new()
            {
                UserName = signupModel.Username,
                Email = signupModel.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                //EncryptedPassword = Aes256Encryption.EncryptData(hashedPassword)
            };
            var result = await userManager.CreateAsync(newUser, signupModel.Password);
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
                    errorMessage += " The email already exists.";

                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = 500, Title = "Internal Server Error", Message = errorMessage });
            }

            if (!await roleManager.RoleExistsAsync(signupModel.Role))
                await roleManager.CreateAsync(new IdentityRole(signupModel.Role));

            await userManager.AddToRoleAsync(newUser, signupModel.Role);
            return Ok(new { Status = 200, Title = "Success", Message = "User created successfully!" } );
        }



        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserModel loginModel)
        {
            var user = await userManager.FindByNameAsync(loginModel.Username);
            if (user is not null)
            {
                //var check await userManager.CheckPasswordAsync(user, loginModel.Password)
                var check = await signInManager.CheckPasswordSignInAsync(user, loginModel.Password, true); //lockoutOnFailure:true
                if (check.Succeeded)
                {
                    var token = await tokensManager.GenerateToken(user);

                    //Response.Headers["Access-Control-Allow-Credentials"] = "true";
                    Response.Cookies.Append("User_Access_Token", token.AccessToken, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.None, Secure = true } );
                    Response.Cookies.Append("Token_Expiry_Date", token.AccessTokenExpiryDate.ToUniversalTime().ToString("s"), new CookieOptions() { HttpOnly = false, SameSite = SameSiteMode.None, Secure = true } );//Sortable date/time
                    Response.Cookies.Append("User_Refresh_Token", token.RefreshToken, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.None, Secure = true, Expires = user.RefreshTokenExpiryDate } );

                    return Ok(token);
                    //return Ok();
                }
                else if (check.IsLockedOut)
                {
                    return Unauthorized(new { Status = 401, Title = "Unauthorized", Message = "The account is locked!" } );
                }
                else if (check == Microsoft.AspNetCore.Identity.SignInResult.Failed)
                {
                    return Unauthorized(new { Status = 401, Title = "Unauthorized", Message = "The password is incorrect!" } );
                }
                else return Unauthorized();
            }
            return Unauthorized(new { Status = 401, Title = "Unauthorized", Message = "The username was not found!" });
        }


        [HttpGet]
        [Route("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("User_Access_Token", new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.None, Secure = true } );
            Response.Cookies.Delete("Token_Expiry_Date", new CookieOptions() { HttpOnly = false, SameSite = SameSiteMode.None, Secure = true } );
            Response.Cookies.Delete("User_Refresh_Token", new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.None, Secure = true } );
            return Ok();
        }


        [HttpGet]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        { 
            string? accessToken = Request.Cookies["User_Access_Token"];
            string? refreshToken = Request.Cookies["User_Refresh_Token"];

            if (accessToken is null || refreshToken is null)
                return BadRequest(new { Status = 400, Title = "Bad Request", Message = "Invalid Client Request" } );

            var claimsPrincipal = tokensManager.GetPrincipalFromExpiredToken(accessToken);
            if (claimsPrincipal is null || claimsPrincipal.Identity is null)
                return BadRequest(new { Status = 400, Title = "Bad Request", Message = "Invalid Access Token" } );

            string? username = claimsPrincipal.Identity.Name;
            var user = await userManager.FindByNameAsync(username);
            string? userRefreshToken = user.RefreshToken;
            if (user is null)
                return NotFound(new { Status = 404, Title = "Not Found", Message = "User not found" } );

            if (userRefreshToken != refreshToken || user.RefreshTokenExpiryDate <= DateTime.Now)
                return BadRequest(new { Status = 400, Title = "Bad Request", Message = "Invalid Refresh Token" } );

            var newToken = tokensManager.CreateNewToken(claimsPrincipal.Claims.ToList());

            user.RefreshToken = newToken.RefreshToken;
            user.RefreshTokenExpiryDate = DateTime.Now.AddDays(2);
            await userManager.UpdateAsync(user);

            Response.Cookies.Append("User_Access_Token", newToken.AccessToken, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.None, Secure = true });
            Response.Cookies.Append("Token_Expiry_Date", newToken.AccessTokenExpiryDate.ToUniversalTime().ToString("s"), new CookieOptions() { HttpOnly = false, SameSite = SameSiteMode.None, Secure = true });
            Response.Cookies.Append("User_Refresh_Token", newToken.RefreshToken, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.None, Secure = true, Expires = null });

            return Ok();
        }



        //[Authorize]
        //[HttpPost]
        //[Route("revoke/{username}")]
        //public async Task<IActionResult> Revoke(string username)
        //{
        //    var user = await _userManager.FindByNameAsync(username);
        //    if (user == null) return BadRequest("Invalid user name");

        //    user.RefreshToken = null;
        //    await _userManager.UpdateAsync(user);

        //    return NoContent();
        //}
    }
}
