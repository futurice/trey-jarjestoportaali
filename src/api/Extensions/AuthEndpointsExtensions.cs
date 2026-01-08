using System.Net;
using Microsoft.AspNetCore.Mvc;
using Supabase.Gotrue.Exceptions;
using Trey.Api.Models;
using Trey.Api.Services;

namespace Trey.Api.Extensions;

public static class AuthEndpointsExtensions
{
  public static RouteGroupBuilder MapAuthApi(this RouteGroupBuilder group)
  {
    group.MapPost("/", AuthorizeUser);
    group.MapPost("/create", CreateUser);
    group.MapPost("/create-multiple", CreateMultipleUsers);
    return group;
  }

  private static async Task<IResult> AuthorizeUser([FromServices] IAuthService authService, [FromBody] LoginData loginData)
  {
    try
    {
      var sessionResponse = await authService.LoginUser(loginData.Username, loginData.Password);
      if (sessionResponse?.User == null) return TypedResults.Unauthorized();

      return TypedResults.Ok(sessionResponse);
    }
    catch (Exception ex) when (ex is UnauthorizedAccessException || ex is GotrueException gEx && (gEx.StatusCode == 400 || gEx.StatusCode == 401))
    {
      return TypedResults.Unauthorized();
    }
    catch (Exception ex)
    {
      Console.WriteLine($"Exception while signing in user {loginData.Username}: {ex.Message}");
      return TypedResults.Problem("An error occurred while attempting to sign in.", statusCode: (int)HttpStatusCode.InternalServerError);
    }
  }

  private static async Task<IResult> CreateUser([FromServices] IAuthService authService, [FromServices] ILogger<FileService> logger, [FromBody] CreateTreyUserRequest createUserData, HttpContext context)
  {
    try
    {
      var user = await authService.GetUserFromContext(context);
      if (user.Role != TreyRole.Admin)
      {
        logger.LogWarning("User {userId} is not authorized to create users", user.Id);
        return TypedResults.Forbid();
      }
      var createdUser = await authService.CreateUser(createUserData);
      return TypedResults.Ok(createdUser);
    }
    catch (Exception ex)
    {
      // Log the exception if logging is available
      Console.WriteLine(ex.Message);
      return TypedResults.Problem("An error occurred while creating the user.", statusCode: (int)HttpStatusCode.InternalServerError);
    }
  }
  private static async Task<IResult> CreateMultipleUsers([FromServices] IAuthService authService, [FromServices] ILogger<FileService> logger, [FromBody] CreateTreyUserRequest[] createUserData, HttpContext context)
  {
    try
    {
      var user = await authService.GetUserFromContext(context);
      if (user.Role != TreyRole.Admin)
      {
        logger.LogWarning("User {userId} is not authorized to create users", user.Id);
        return TypedResults.Forbid();
      }
      var users = await authService.CreateMultipleUsers(createUserData);
      return TypedResults.Ok(users);
    }
    catch (Exception ex)
    {
      // Log the exception if logging is available
      Console.WriteLine(ex.Message);
      return TypedResults.Problem("An error occurred while creating the users.", statusCode: (int)HttpStatusCode.InternalServerError);
    }
  }

  public class LoginData
  {
    public required string Username { get; set; }
    public required string Password { get; set; }
  }
}
