using backend.Entities;
using backend.Managers;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using MimeKit;
using System.Text;
using MailKit.Net.Smtp;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : Controller // with view support
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

            string confirmationToken = await userManager.GenerateEmailConfirmationTokenAsync(newUser);
            string token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(confirmationToken));
            string tokenExpirationTime = DateTime.Now.AddMinutes(30).ToUniversalTime().ToLongTimeString();
            string expirationTime = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(tokenExpirationTime));

            //The user clicks this link to confirm the email. This link executes ConfirmEmail action in Auth controller.
            string? confirmationLink = Url.Action("ConfirmEmail", "Authentication", new { email = newUser.Email, token, expirationTime }, Request.Scheme);
            SendEmail("Confirm Email", newUser.Email, confirmationLink);

            return Ok(new { Status = 200, Title = "Success", Message = "User created successfully!" });
        }
        

        [HttpGet("confirmEmail/{email}/{token}/{expirationTime}")]
        public async Task<IActionResult> ConfirmEmail([FromRoute] string email, [FromRoute] string token, [FromRoute] string expirationTime)
        {
            User? user = await userManager.FindByEmailAsync(email);
            if (user is null)
                return NotFound("No user with the email "+email+" was found.");

            if (user.EmailConfirmed == true)
                return Ok("Your email is already confirmed!");

            string tokenExpirationTime = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(expirationTime));
            if (DateTime.Now.ToUniversalTime() >= DateTime.Parse(tokenExpirationTime))
            {
                ViewBag.Email = email;
                return View("~/Views/ExpiredConfirmationLink.cshtml");
            }

            string confirmationToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
            IdentityResult result = await userManager.ConfirmEmailAsync(user, confirmationToken);

            if (result.Succeeded)
                return Ok("Email confirmed successfully!");
            else
                return Unauthorized("Email confirmation failed!");
        }


        [HttpGet("resendConfirmationLink/{email}")]
        public async Task<IActionResult> ResendConfirmationLink([FromRoute] string email)
        {
            User? user = await userManager.FindByEmailAsync(email);
            if (user is not null)
            {
                string confirmationToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
                string token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(confirmationToken));
                string tokenExpirationTime = DateTime.Now.AddMinutes(30).ToUniversalTime().ToLongTimeString();
                string expirationTime = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(tokenExpirationTime));
                string? confirmationLink = Url.Action("ConfirmEmail", "Authentication", new { email, token, expirationTime }, Request.Scheme);
                SendEmail("Confirm Email", email, confirmationLink);
                return Ok("New link sent successfully!");
            }
            else return NotFound("No user with the email " + email + " was found.");
        }


        [HttpGet("forgotPassword/{email}")]
        public async Task<IActionResult> ForgotPassword([FromRoute] string email)
        {
            User? user = await userManager.FindByEmailAsync(email);
            if (user is null)
                return NotFound(new { Status = 404, Title = "User Not Found", Message = "No user with the email " + email + " exists." });

            string resetPasswordToken = await userManager.GeneratePasswordResetTokenAsync(user);
            string token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(resetPasswordToken));
            string tokenExpirationTime = DateTime.Now.AddMinutes(30).ToUniversalTime().ToLongTimeString();
            string expirationTime = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(tokenExpirationTime));

            string? link = Url.Action("ResetPassword", "Authentication", new { email = user.Email, token, expirationTime }, Request.Scheme);
            SendEmail("Reset Password", user.Email, link);

            return Ok();
        }


        [HttpGet("resetPassword/{email}/{token}/{expirationTime}")]
        public ViewResult ResetPassword([FromRoute] string email, [FromRoute] string token, [FromRoute] string expirationTime)
        {
            string tokenExpirationTime = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(expirationTime));
            if (DateTime.Now.ToUniversalTime() >= DateTime.Parse(tokenExpirationTime))
            {
                var errorModel = new ResetPasswordErrorModel { ErrorMessage = "The reset password link expired!" };
                return View("~/Views/ResetPasswordError.cshtml", errorModel);
            }

            var model = new ResetPasswordModel { Email = email, Token = token, TokenExpirationTime = expirationTime };
            return View("~/Views/ResetPasswordView.cshtml", model);
        }


        [HttpPost("resetPassword")]
        public async Task<IActionResult> ResetPasswordPost([FromForm] ResetPasswordModel model)
        {
            var errorModel = new ResetPasswordErrorModel { Token=model.Token, Email=model.Email, ExpirationTime=model.TokenExpirationTime };

            User? user = await userManager.FindByEmailAsync(model.Email);
            if (user is null)
            {
                errorModel.ErrorMessage = "No user with the email " + model.Email + " was found.";
                return View("~/Views/ResetPasswordError.cshtml", errorModel);
            }

            string expirationTime = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.TokenExpirationTime));
            if (DateTime.Now.ToUniversalTime() >= DateTime.Parse(expirationTime))
            {
                errorModel.ErrorMessage = "The reset password link expired!";
                return View("~/Views/ResetPasswordError.cshtml", errorModel);
            }

            string token = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));

            IdentityResult result = await userManager.ResetPasswordAsync(user, token, model.Password);
            if (result.Succeeded is false)
            {

                if (result.Errors.Any(error => error.Code == "InvalidToken"))
                {
                    errorModel.ErrorMessage = "This link was already used once.";
                }
                else
                {
                    errorModel.FormError = true;
                    errorModel.ErrorMessage = "Errors:";
                    foreach (var error in result.Errors)
                        errorModel.FormErrors.Add(error.Description);
                }
                return View("~/Views/ResetPasswordError.cshtml", errorModel);
            }

            return View("~/Views/ResetPasswordConfirmation.cshtml");
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserModel loginModel)
        {
            User? user;
            if (loginModel.EmailLogin)
                user = await userManager.FindByEmailAsync(loginModel.UserIdentifier);
            else
                user = await userManager.FindByNameAsync(loginModel.UserIdentifier);

            if (user is not null)
            {
                if (user.EmailConfirmed == false)
                    return Unauthorized(new { Status = 401, Title = "Unauthorized", Message = "Users cannot sign in without a confirmed email." });

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

                    return Ok(new { username = user.UserName }); //return Ok(token);
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
            if (loginModel.EmailLogin)
                return Unauthorized(new { Status = 401, Title = "Unauthorized", Message = "The email " + loginModel.UserIdentifier + " was not found!" });
            else
                return Unauthorized(new { Status = 401, Title = "Unauthorized", Message = "The username was not found!" });
        }


        [HttpGet("logout")]
        public async Task<IActionResult> LogoutAsync()
        {
            var username = User.Identity?.Name;
            if (username is not null)
            {
                var user = await userManager.FindByNameAsync(username);
                if (user is not null)
                {
                    user.RefreshToken = null;
                    user.RefreshTokenExpiryDate = null;
                    await userManager.UpdateAsync(user);
                }
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


        private static void SendEmail(string subject, string userEmail, string? link)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Find Band Members App", "mihaelapv98@gmail.com"));
            message.To.Add(new MailboxAddress(userEmail, userEmail));

            message.Subject = subject;
            if (subject == "Confirm Email")
                message.Body = new TextPart("plain") { Text = "Click the following link to confirm your email. The link will expire in 30 minutes.\n" + link + "\nIf you did not request this, ignore the email." };
            else
                message.Body = new TextPart("plain") { Text = "Click here to reset your password: " + link };

            using var client = new SmtpClient();
            client.Connect("smtp.gmail.com", 587);
            client.Authenticate("mihaelapv98@gmail.com", "oigteofozgttnhqn");
            client.Send(message);
            client.Disconnect(true);
        }

    }
}
