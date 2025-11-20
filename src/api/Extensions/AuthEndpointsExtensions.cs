using System.ComponentModel.DataAnnotations;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Trey.Api.Models;
using Trey.Api.Repositories;
using static Supabase.Gotrue.StatelessClient;

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
    if (userEmailResponse?.Content == null || userEmailResponse.ResponseMessage?.StatusCode == HttpStatusCode.NotFound)
    {
      return TypedResults.Unauthorized();
    }
    var userEmail = userEmailResponse.Content.ToString().Trim('"');
    if (string.IsNullOrEmpty(userEmail))
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
