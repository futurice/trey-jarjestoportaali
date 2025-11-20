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
    var userEmailResponse = await supabase.Rpc("email_for_username", new { p_username = loginData.Username });
    var userEmail = JsonConvert.DeserializeObject<string>(userEmailResponse?.Content?.ToString() ?? "");
    if (userEmailResponse?.Content == null || userEmailResponse.ResponseMessage?.StatusCode == HttpStatusCode.NotFound)
    {
      return TypedResults.Unauthorized();
    }
    else if (string.IsNullOrEmpty(userEmail) || !email.IsValid(userEmail))
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
