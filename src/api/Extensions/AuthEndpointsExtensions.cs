using System.ComponentModel.DataAnnotations;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Trey.Api.Extensions;

public static class AuthEndpointsExtensions
{
  public static RouteGroupBuilder MapAuthApi(this RouteGroupBuilder group)
  {
    group.MapPost("/", AuthorizeUser);
    return group;
  }

  private static async Task<IResult> AuthorizeUser(Supabase.Client supabase, [FromBody] LoginData loginData)
  {
    var email = new EmailAddressAttribute();
    if (email.IsValid(loginData.Username))
    {
      var emailResponse = await supabase.Auth.SignInWithPassword(loginData.Username, loginData.Password);
      if (emailResponse?.User == null)
      {
        return TypedResults.Unauthorized();
      }
      return TypedResults.Ok(emailResponse);
    }
    // The 'email_for_username' RPC function retrieves the email address associated with the given username from the database.
    // This is necessary for the username-based login flow, as Supabase authentication requires an email address.
    // By mapping the provided username to its corresponding email, we enable users to log in using their username.
    string? userEmail = null;
    Supabase.Gotrue.Responses.RpcResponse userEmailResponse = null;
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
    else if (!email.IsValid(userEmail))
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

  public class LoginData
  {
    public required string Username { get; set; }
    public required string Password { get; set; }
  }
}
