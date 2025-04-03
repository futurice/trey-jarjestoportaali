using Newtonsoft.Json.Linq;
using Stytch.net.Clients;
using Stytch.net.Models.Consumer;
using Trey.Api.Models;

namespace Trey.Api.Services;

public interface IAuthService
{
    Task<TreyUser> GetUserFromContext(HttpContext context);
}

internal sealed class AuthService(ConsumerClient client) : IAuthService
{
    public async Task<TreyUser> GetUserFromContext(HttpContext context)
    {
        var token = GetTokenFromHeader(context);
        var session = await AuthenticateSession(token);
        if (session.UserId == null)
        {
            throw new UnauthorizedAccessException("No valid session found");
        }

        var user = await GetUserById(session.UserId);

        return user;
    }

    private async Task<TreyUser> GetUserById(string userId)
    {
        var user = await client.Users.Get(new UsersGetRequest(userId));

        var metadata = MetadataToDictionary(user.TrustedMetadata);
        return new TreyUser
        {
            Name = user.Name.FirstName + " " + user.Name.LastName,
            OrganizationId = metadata["organizationId"] ?? "",
            Role = metadata["role"].ToTreyRole()
        };
    }

    private static Dictionary<string, string> MetadataToDictionary(object metadata)
    {
        if (metadata is JObject metadataObject)
        {
            return metadataObject.ToObject<Dictionary<string, string>>() ?? [];
        }

        return [];
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
                SessionJwt = sessionJwt,
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