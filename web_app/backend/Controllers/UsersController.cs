using Microsoft.AspNetCore.Mvc;
using backend.Managers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;

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

 
        [HttpGet("{id}")]
        public IActionResult GetUserById([FromRoute] string id)
        {
            var user = manager.GetUserById(id);
            return Ok(user);
        }


        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] string id)
        {
            manager.Delete(id);
            return Ok();
        }


        [HttpGet("getByUsername/{username}")]
        public IActionResult GetUserByUsername([FromRoute] string username)
        {
            var user = manager.GetUserByUsername(username);
            if (user != null)
                return Ok(user);
            else
                return NotFound();
        }


        [HttpPut]
        public IActionResult Update([FromBody] UserModel model)
        {
            manager.Update(model);
            return Ok();
        }


        [HttpPost]
        public IActionResult Create([FromBody] UserModel model)
        {
            manager.Create(model);
            return Ok();
        }

    }
}
