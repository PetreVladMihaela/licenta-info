using Microsoft.AspNetCore.Mvc;
using backend.Managers;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using backend.Entities;
using Microsoft.AspNetCore.Authorization;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class ProfilesController : ControllerBase
    {
        private readonly IProfilesManager manager;
        private readonly UserManager<User> userManager;

        public ProfilesController(IProfilesManager manager, UserManager<User> userManager)
        {
            this.manager = manager;
            this.userManager = userManager;
        }


        [HttpGet]
        public IActionResult GetAllUserProfiles()
        {
            return Ok(manager.GetUserProfiles());
        }


        [AllowAnonymous]
        [HttpGet("getByUsername/{username}")]
        public IActionResult GetUserProfile([FromRoute] string username)
        {
            UserProfileModel? profile = manager.GetProfileByUsername(username);

            if (profile is not null)
            {
                if (username == User.Identity?.Name)
                    profile.CanBeEdited = true;

                return Ok(profile);
            }

            return NotFound(new { Status = 404, Title = "Profile Not Found", Message = "Profile of user '" + username + "' was not found." });
        }


        private async Task<IActionResult> ManageUserProfile(string action, UserProfileModel model)
        {
            //User? user = await userManager.FindByEmailAsync(model.Email);
            User? user = await userManager.FindByNameAsync(model.Username);

            if (user is not null)
            {
                if (user.UserName != User.Identity?.Name)
                    return StatusCode(StatusCodes.Status403Forbidden);

                if (user.PhoneNumber != model.PhoneNumber)
                {
                    user.PhoneNumber = model.PhoneNumber;
                    await userManager.UpdateAsync(user);
                }
                if (action == "Create Profile")
                    manager.CreateUserProfile(model, user.Id);
                else 
                    manager.UpdateUserProfile(model);
                return Ok();
            }

            //return NotFound(new { Status = 404, Title = "User Not Found", Message = "No user with the email '" + model.Email + "' exists." });
            return NotFound(new { Status = 404, Title = "User Not Found", Message = "No user named '" + model.Username + "' exists." });
        }


        [HttpPost]
        public Task<IActionResult> CreateUserProfile([FromBody] UserProfileModel model)
        {
            return ManageUserProfile("Create Profile", model);
        }


        [HttpPut]
        public Task<IActionResult> UpdateUserProfile([FromBody] UserProfileModel model)
        {
            return ManageUserProfile("Update Profile", model);
        }


        [HttpDelete("{username}")]
        public IActionResult DeleteUserProfile([FromRoute] string username)
        {
            if (username != User.Identity?.Name)
                return StatusCode(StatusCodes.Status403Forbidden);

            manager.DeleteUserProfile(username);
            return Ok();
        }

    }
}
