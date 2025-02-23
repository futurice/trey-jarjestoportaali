using Microsoft.AspNetCore.Mvc;
using Stytch.net.Models.Consumer;
using Trey.Api.Models;
using Trey.Api.Services;

namespace Trey.Api.Extensions;

public static class UserEndpointsExtensions
{
  public static RouteGroupBuilder MapUserApi(this RouteGroupBuilder group)
  {
    group.MapGet("/", GetUsers);
    group.MapGet("/{UserId}", GetUser);
    group.MapPut("/{UserId}", UpdateUser);
    return group;
  }

  public static async Task<IResult> GetUsers([FromServices] UserService service)
  {
    var users = await service.GetUsersAsync();
    return TypedResults.Ok(users);
  }

  public static async Task<IResult> GetUser([FromServices] UserService service, string UserId)
  {
    var user = await service.GetUserAsync(UserId);
    return TypedResults.Ok(user);
  }
  private static async Task<IResult> UpdateUser([FromServices] UserService service, string UserId, [FromBody] UpdateUserDTO userData)
  {
    var user = await service.UpdateUser(UserId, userData);
    return TypedResults.Ok(user);
  }
}