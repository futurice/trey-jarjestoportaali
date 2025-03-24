using System.IdentityModel.Tokens.Jwt;
using System.Runtime.InteropServices.JavaScript;
using System.Security.Authentication;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Stytch.net.Clients;
using Stytch.net.Clients.Consumer;
using Stytch.net.Models.Consumer;
using Trey.Api.Models;

namespace Trey.Api.Services;

public interface IAuthService
{
    Task<TreyUser> GetUserFromContext(HttpContext context);
}

internal sealed class AuthService(ConsumerClient client, ILogger<AuthService> logger) : IAuthService
{
    public async Task<TreyUser> GetUserFromContext(HttpContext context)
    {
        var token = GetTokenFromHeader(context);
        var session = await AuthenticateSession(token);
        if (session.CustomClaims is Dictionary<string, string> claims)
        {
            return new TreyUser
            {
                Name = session.UserId,
                OrganizationId = claims.GetValueOrDefault("organization", ""),
                Role = claims.GetValueOrDefault("role", "")?.ToTreyRole() ?? TreyRole.None
            };
        }
        throw new UnauthorizedAccessException($"Custom claims missing from session");
    }

    private static string GetTokenFromHeader(HttpContext context)
    {
        var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
        if (authHeader is not { Length: > 7 } || !authHeader.StartsWith("Bearer "))
        {
            throw new UnauthorizedAccessException("No valid authorization header found");
        }

        return authHeader["Bearer ".Length..];
    }

    private async Task<Session> AuthenticateSession(string sessionJwt)
    {
        try
        {
            var request = new SessionsAuthenticateRequest
            {
                SessionToken = sessionJwt,
                SessionDurationMinutes = 60
            };
            
            var response = await client.Sessions.Authenticate(request);
            return response.Session;
        }
        catch (Exception ex)
        {
            throw new UnauthorizedAccessException($"Session validation failed: {ex.Message}");
        }
    }
}