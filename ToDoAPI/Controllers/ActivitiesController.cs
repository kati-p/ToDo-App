using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToDoAPI.Models;
using System.Security;

namespace ToDoAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class ActivitiesController : ControllerBase
{
      private readonly ILogger<ActivitiesController> _logger;

      public ActivitiesController(ILogger<ActivitiesController> logger)
      {
            _logger = logger;
      }

      [HttpGet]
      [Route("")]
      [Authorize(Roles = "user")]
      public IActionResult GetAll()
      {
            var db = new ToDoDbContext();
            var userID = User?.Identity?.Name;
            if (userID == null) return Unauthorized();
            var activities = db.Activities
            .Where(a => a.UserId == userID)
            .Select(a => new {
                  id = a.Id,
                  name = a.Name,
                  when = a.When
            })
            .ToList();

            if (!activities.Any()) return NoContent();

            return Ok(activities);
      }

      [HttpGet]
      [Route("{Id}")]
      [Authorize(Roles = "user")]
      public IActionResult Get(uint Id)
      {
            
            var db = new ToDoDbContext();
            var userID = User?.Identity?.Name;
            if (userID == null) return Unauthorized();
            var activity = db.Activities
            .Where(a => a.Id == Id && a.UserId == userID)
            .Select(a => new {
                  id = a.Id,
                  name = a.Name,
                  when = a.When

            })
            .FirstOrDefault();

            if (activity == null) return NoContent();

            return Ok(activity);
      }

      [HttpPost]
      [Authorize(Roles = "user")]
      public IActionResult Post([FromBody] DTOs.Activity data)
      {
            var db = new ToDoDbContext();
            var userID = User?.Identity?.Name;
            if (userID == null) return Unauthorized();
            var activity = new Models.Activity();
            activity.UserId = userID;
            activity.Name = data.Name;
            activity.When = data.When;

            db.Activities.Add(activity);
            db.SaveChanges();

            return Ok(new {id = activity.Id});
      }

      [HttpPut]
      [Route("{Id}")]
      [Authorize(Roles = "user")]
      public IActionResult Put(uint Id, [FromBody] DTOs.Activity data)
      {
            var db = new ToDoDbContext();
            var userID = User?.Identity?.Name;
            if (userID == null) return Unauthorized();
            var activity = db.Activities
            .Where(a => a.Id == Id && a.UserId == userID)
            .FirstOrDefault();
            if (activity == null) return NotFound();

            activity.Name = data.Name;
            activity.When = data.When;

            db.SaveChanges();

            return Ok(new {id = activity.Id});
      }

      [HttpDelete]
      [Route("{Id}")]
      [Authorize(Roles = "user")]
      public IActionResult Delete(uint Id)
      {
            var db = new ToDoDbContext();
            var userID = User?.Identity?.Name;
            if (userID == null) return Unauthorized();
            var activity = db.Activities
            .Where(a => a.Id == Id && a.UserId == userID)
            .FirstOrDefault();
            if (activity == null) return NotFound();

            db.Activities.Remove(activity);
            db.SaveChanges();

            return Ok();
      }
}