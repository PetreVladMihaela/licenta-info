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

    public class BandsController : ControllerBase
    {
        private readonly IBandsManager manager;
        private readonly UserManager<User> userManager;

        public BandsController(IBandsManager manager, UserManager<User> userManager)
        {
            this.manager = manager;
            this.userManager = userManager;
        }

        [HttpGet("getAllBands")]
        public IActionResult GetAllBands()
        {
            return Ok(manager.GetMusicalBands());
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("bandsToDelete")]
        public IActionResult GetBandsToDelete()
        {
            return Ok(manager.GetBandsWithNoMembers());
        }


        [HttpGet("{bandId}/bandInfo")]
        public IActionResult GetBandInfo([FromRoute] string bandId)
        {
            MusicalBandModel? band = manager.GetCompleteBandById(bandId);

            if (band is not null) 
                return Ok(band);
            else
                return NotFound(new { Status = 404, Title = "Band Not Found", Message = "No band with the id " + bandId + " exists." });
        }


        private async Task<IActionResult> ManageBand(string action, MusicalBandModel model, string username)
        {
            User? user = await userManager.FindByNameAsync(username);
            if (user is not null)
            {
                if (user.UserName != User.Identity?.Name)
                    return StatusCode(StatusCodes.Status403Forbidden);

                if (action == "Create Band")
                {
                    string newBandId = manager.CreateMusicalBand(model, user.Id);
                    return Ok(new { newBandId });
                }
                else
                {
                    bool updatedBand = manager.UpdateMusicalBand(model);
                    if (updatedBand) return Ok();
                    else return NotFound(new { Status = 404, Title = "Band Not Found", Message = "No band with the id " + model.BandId + " exists." });
                }
            }
            else return NotFound(new { Status = 404, Title = "User Not Found", Message = "No user named '" + username + "' exists." });
        }


        [Authorize]
        [HttpPost("{username}")]
        public Task<IActionResult> CreateBand([FromBody] MusicalBandModel model, [FromRoute] string username)
        {
            return ManageBand("Create Band", model, username);
        }


        [Authorize]
        [HttpPut("{username}")]
        public Task<IActionResult> UpdateBand([FromBody] MusicalBandModel model, [FromRoute] string username)
        {
            return ManageBand("Update Band", model, username);
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteBand([FromRoute] string id)
        {
            manager.DeleteMusicalBand(id);
            return Ok();
        }



        [Authorize]
        [HttpPost("{username}/createBandMatches")]
        public IActionResult CreateMatches([FromBody] BandUserMatchModel[] models, [FromRoute] string username)
        {
            if (username != User.Identity?.Name)
                return StatusCode(StatusCodes.Status403Forbidden);

            manager.SaveBandUserMatches(models);
            return Ok();
        }


        [HttpGet("{bandId}/getMatchedUsers")]
        public IActionResult GetMatchedUsers([FromRoute] string bandId)
        {
            return Ok(manager.GetBandMatches(bandId));
        }


        [Authorize]
        [HttpPut("{username}/updateBandUserMatch")]
        public IActionResult UpdateMatch([FromBody] BandUserMatchModel model, [FromRoute] string username)
        {
            if (username != User.Identity?.Name)
                return StatusCode(StatusCodes.Status403Forbidden);

            manager.UpdateBandUserMatch(model);
            return Ok();
        }


        [Authorize]
        [HttpDelete("{bandId}/deleteBandMatches/{username}")]
        public IActionResult DeleteAllBandMaches([FromRoute] string bandId, [FromRoute] string username)
        {
            if (username != User.Identity?.Name)
                return StatusCode(StatusCodes.Status403Forbidden);

            manager.DeleteBandMatches(bandId);
            return Ok();
        }


        [HttpGet("{username}/leaveBand")]
        public async Task<IActionResult> LeaveBand([FromRoute] string username)
        {
            if (username != User.Identity?.Name)
                return StatusCode(StatusCodes.Status403Forbidden);

            User? user = await userManager.FindByNameAsync(username);

            if (user is null)
                return NotFound(new { Status = 404, Title = "Not Found", Message = "The user " + username + " was not found." });

            manager.LeaveBand(user.Id);
            return Ok();
        }

    }
}
