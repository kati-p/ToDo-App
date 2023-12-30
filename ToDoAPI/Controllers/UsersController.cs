using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using ToDoAPI.Models;
using System.Security.Cryptography;

namespace ToDoAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<TokensController> _logger;

    public UsersController(ILogger<TokensController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    [Route("")]
    public IActionResult Post([FromBody] DTOs.Login data)
    {

        if (data.Id.Length != 13) return BadRequest("ID must have 13 length numbers.");

        var db = new ToDoDbContext();

        var hasUser = db.Users.Find(data.Id);
        if (hasUser != null) return BadRequest("Have this ID already");

        // generate a 128-bit salt using a secure PRNG
        byte[] randomSalt = new byte[128 / 8];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomSalt);
        }
        var salt = Convert.ToBase64String(randomSalt);

        string hash = Convert.ToBase64String(
            KeyDerivation.Pbkdf2(
                password: data.Password,
                salt: Convert.FromBase64String(salt),
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8
            )
        );

        var user = new Models.User
        {
            Id = data.Id,
            Password = hash,
            Salt = salt
        };

        db.Users.Add(user);
        db.SaveChanges();

        return Ok();
    }
}