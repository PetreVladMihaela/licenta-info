using Microsoft.AspNetCore.Mvc;
using backend.Managers;
using backend.Models;
using backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
//using System.Security.Claims;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUsersManager manager;
        private readonly ITokensManager tokensManager;
        private readonly UserManager<User> userManager;

        public UsersController(IUsersManager manager, ITokensManager tokensManager, UserManager<User> userManager)
        {
            this.manager = manager;
            this.tokensManager = tokensManager;
            this.userManager = userManager;
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("")]
        public IActionResult GetAllUsers()
        {
            List<User> users = manager.GetAllUsers();
            return Ok(users);
        }


        [HttpGet("getByUsername/{username}")]
        public IActionResult GetUserByUsername([FromRoute] string username)
        {
            string? currentUser = User.Identity?.Name;
            if (currentUser != username)
                return StatusCode(StatusCodes.Status403Forbidden); //return Forbid();

            UserModel? user = manager.GetUserByUsernameAsync(username).Result;
            if (user is not null)
                return Ok(user);
            else
                return NotFound(new { Status = 404, Title = "Not Found", Message = "The user named '"+username+"' was not found." });
        }


        [HttpPut("changeUsername/{oldUsername}")]
        public async Task<IActionResult> UpdateUsername([FromBody] string newUsername, [FromRoute] string oldUsername)
        {
            if (User.Identity?.Name != oldUsername)
                return StatusCode(StatusCodes.Status403Forbidden);

            var existingUser = await userManager.FindByNameAsync(newUsername);
            if (existingUser is not null)
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Status = 500,
                    Title = "Internal Server Error",
                    Message = "The username '" + newUsername + "' is taken."
                });

            var updateResult = await manager.UpdateUserAsync("Username", newUsername, oldUsername);
            var updatedUser = updateResult.Item1;
            if (updatedUser is not null)
            {
                if (updateResult.Item2) //update successful
                {
                    TokenModel token = await tokensManager.GenerateToken(updatedUser);

                    Response.Cookies.Append("User_Access_Token", token.AccessToken,
                        new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.None, Secure = true });
                    Response.Cookies.Append("Token_Expiry_Date", token.AccessTokenExpiryDate.ToString("s"),//Sortable date/time
                        new CookieOptions() { HttpOnly = false, SameSite = SameSiteMode.None, Secure = true, Expires = token.AccessTokenExpiryDate });
                    Response.Cookies.Append("User_Refresh_Token", token.RefreshToken,
                        new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.None, Secure = true, Expires = updatedUser.RefreshTokenExpiryDate });

                    return Ok(); //return Ok(newUsername);
                }
                else return BadRequest("The username '" + newUsername + "' is invalid.");
            }
            else
                return NotFound("The user named '" + oldUsername + "' does not exist.");
        }


        [HttpPut("changeEmail/{username}")]
        public async Task<IActionResult> UpdateEmail([FromBody] string newEmail, [FromRoute] string username)
        {
            if (User.Identity?.Name != username)
                return StatusCode(StatusCodes.Status403Forbidden);

            var existingUser = await userManager.FindByEmailAsync(newEmail);
            if (existingUser is not null)
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Status = 500,
                    Title = "Internal Server Error",
                    Message = "An account with the email '" + newEmail + "' already exists."
                });

            var updateResult = await manager.UpdateUserAsync("Email", newEmail, username);
            var updatedUser = updateResult.Item1;
            if (updatedUser is not null)
            {
                if (updateResult.Item2)
                    return Ok();
                else
                    return BadRequest("'" + newEmail + "' is not a valid email address.");
            }
            else return NotFound("The user named '" + username + "' does not exist.");
        }


        [HttpPut("changePassword")]
        public async Task<IActionResult> UpdateUserPassword([FromBody] ChangePasswordModel model)
        {
            //var nameClaim = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Name); 
            //if (nameClaim is not null) { var currentUser = nameClaim.Value; }
            if (User.Identity?.Name != model.Username)
                return StatusCode(StatusCodes.Status403Forbidden);

            User? user = await userManager.FindByNameAsync(model.Username);
            if (user is null)
                return NotFound("No user named '" + model.Username + "' was found.");

            IdentityResult result = await userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
            if (result.Succeeded)
                return Ok("The password was changed successfully!");
            else
                return BadRequest(result.Errors);
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{userId}")]
        public IActionResult DeleteUser([FromRoute] string userId)
        {
            manager.Delete(userId);
            return Ok();
        }

    }
}
