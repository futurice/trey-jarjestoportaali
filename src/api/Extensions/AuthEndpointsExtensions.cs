using System.ComponentModel.DataAnnotations;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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

  private static async Task<IResult> AuthorizeUser(Supabase.Client supabase, [FromBody] LoginData loginData)
  {
    var email = new EmailAddressAttribute();
    if (email.IsValid(loginData.Username))
    {
      try
      {
        var emailResponse = await supabase.Auth.SignInWithPassword(loginData.Username, loginData.Password);
        if (emailResponse?.User == null)
        {
          return TypedResults.Unauthorized();
        }
        return TypedResults.Ok(emailResponse);
      }
      catch (GotrueException ex)
      {
        // Log the exception if logging is available
        if (ex.StatusCode == 400 || ex.StatusCode == 401)
        {
          return TypedResults.Unauthorized();
        }
        return TypedResults.Problem("An error occurred while attempting to sign in with email.", statusCode: (int)HttpStatusCode.InternalServerError);
      }

    }
    // The 'email_for_username' RPC function retrieves the email address associated with the given username from the database.
    // This is necessary for the username-based login flow, as Supabase authentication requires an email address.
    // By mapping the provided username to its corresponding email, we enable users to log in using their username.
    string? userEmail = null;
    Supabase.Postgrest.Responses.BaseResponse? userEmailResponse = null;
    try
    {
      userEmailResponse = await supabase.Rpc("email_for_username", new { p_username = loginData.Username });
      userEmail = JsonConvert.DeserializeObject<string>(userEmailResponse?.Content?.ToString() ?? "");
    }
    catch (Exception ex)
    {
      // Log the exception if logging is available
      return TypedResults.Problem("An error occurred while retrieving the user email for the provided username.", statusCode: (int)HttpStatusCode.InternalServerError);
    }
    if (userEmailResponse?.Content == null || userEmailResponse.ResponseMessage?.StatusCode == HttpStatusCode.NotFound)
    {
      return TypedResults.Unauthorized();
    }
    else if (userEmail == null || !email.IsValid(userEmail))
    {
      return TypedResults.Unauthorized();
    }
    var response = await supabase.Auth.SignInWithPassword(userEmail, loginData.Password);
    if (response?.User == null)
    {
      return TypedResults.Unauthorized();
    }
    return TypedResults.Ok(response);
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
