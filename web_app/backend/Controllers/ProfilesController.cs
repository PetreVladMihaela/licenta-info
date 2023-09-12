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


        [HttpPost("surveyResults")]
        public IActionResult GetSurveyResults([FromBody] BandMembersSurveyModel surveyModel)
        {
            return Ok(manager.GetSurveyResults(surveyModel));
        }


        [HttpGet("{userId}/bandInvitations")]
        public IActionResult GetBandsInvitedToJoin([FromRoute] string userId)
        {
            return Ok(manager.GetInvitationsToJoinBands(userId));
        }


        [HttpPost("{username}/acceptInvitation")]
        public IActionResult AcceptInvitation([FromRoute] string username, [FromBody] BandUserMatchModel invitation)
        {
            if (username != User.Identity?.Name)
                return StatusCode(StatusCodes.Status403Forbidden);

            manager.AcceptInvitationToJoinBand(invitation);
            return Ok();
        }


        [HttpPost("{username}/uploadProfileImage")]
        public async Task<IActionResult> UploadProfileImage([FromRoute] string username) 
        {
            //IFormFile file = Request.Form.Files[0];
            IFormCollection formCollection = await Request.ReadFormAsync();
            IFormFile file = formCollection.Files[0];

            if (file.Length > 0)
            {
                //string uploadsFolder = "ProfileImages";
                //if (Directory.Exists(uploadsFolder) is false)
                //    Directory.CreateDirectory(uploadsFolder);

                //string pathToSave = Path.Combine(Directory.GetCurrentDirectory(), uploadsFolder);
                //string fileName = Guid.NewGuid().ToString() + "_" + file.FileName;
                //string filePath = Path.Combine(pathToSave, fileName);

                //using (var fileStream = new FileStream(filePath, FileMode.Create))
                //{
                //    file.CopyTo(fileStream);
                //}

                using var fileStream = file.OpenReadStream();
                byte[] imageBytes = new byte[file.Length];
                fileStream.Read(imageBytes, 0, (int)file.Length);

                manager.SaveProfileImage(username, imageBytes);

                return Ok(new { imageBytes });
            }
            else return BadRequest();
        }

        [AllowAnonymous]
        [HttpDelete("{username}/deleteProfileImage")]
        public IActionResult DeleteProfileImage([FromRoute] string username)
        {
            manager.DeleteProfileImage(username);
            return Ok();
        }

    }
}
