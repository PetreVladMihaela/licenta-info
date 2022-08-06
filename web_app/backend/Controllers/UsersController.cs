using Microsoft.AspNetCore.Mvc;
using backend.Managers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUsersManager manager;

        public UsersController(IUsersManager manager)
        {
            this.manager = manager;
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("")]
        public IActionResult GetAllUsers()
        {
            var users = manager.GetAllUsers();
            return Ok(users);
        }


        [HttpGet("getByUsername/{username}")]
        public async Task<IActionResult> GetUserByUsernameAsync([FromRoute] string username)
        {
            var usernameClaim = User.FindFirst(claim => claim.Type == ClaimTypes.Name);
            if (usernameClaim is null)
                return Forbid();

            var currentUser = usernameClaim.Value;
            if (currentUser != username)
                return Forbid();

            var user = await manager.GetUserByUsernameAsync(username);
            return Ok(user);
        }


        [AllowAnonymous]
        [HttpGet("checkUsername/{username}")]
        public async Task<IActionResult> CheckIfUsernameExists([FromRoute] string username)
        {
            var user = await manager.GetUserByUsernameAsync(username);
            if (user is null)
                return Ok(new { UsernameExists = false });
            else
                return Ok(new { UsernameExists = true });
        }


        [HttpPut]
        public IActionResult Update([FromBody] UserModel model)
        {
            var user = manager.Update(model);
            if (user is not null)
                return Ok();
            else
                return NotFound();
        }


        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] string id)
        {
            manager.Delete(id);
            return Ok();
        }


        //[HttpPost]
        //public IActionResult Create([FromBody] UserModel model)
        //{
        //    manager.Create(model);
        //    return Ok();
        //}

    }
}
