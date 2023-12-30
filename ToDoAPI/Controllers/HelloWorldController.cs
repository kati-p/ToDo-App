using Microsoft.AspNetCore.Mvc;

namespace ToDoAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class HelloWorldController : ControllerBase
{
    private readonly ILogger<HelloWorldController> _logger;

    public HelloWorldController(ILogger<HelloWorldController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    [Route("")]
    public IActionResult Get()
    {
        return Ok(new { msg = "Hello World!"});
    }
}
