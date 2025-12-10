using Supabase.Gotrue;
using Trey.Api.Models;
using static Supabase.Gotrue.StatelessClient;

namespace Trey.Api.Services;

public interface IAuthService
{
    Task<TreyUser> GetUserFromContext(HttpContext context);
    Task<TreyUser?> FindUserById(string userId);
    Task<bool> IsUserAuthorized(TreyUser user, string? organizationId);
}

internal sealed class AuthService : IAuthService
{
    private readonly StatelessClient statelessClient;
    private readonly Supabase.Client supabaseClient;
    private readonly StatelessClientOptions options;
    public AuthService(Supabase.Client supabaseClient)
    {
        var baseUrl = Environment.GetEnvironmentVariable("SUPABASE_URL") ?? throw new ArgumentNullException("SUPABASE_URL");
        options = new StatelessClientOptions
        {
            Url = $"{baseUrl}/auth/v1",
            Headers =
            {
                { "apikey", Environment.GetEnvironmentVariable("SUPABASE_KEY") ?? throw new ArgumentNullException("SUPABASE_KEY") }
            }
        };
        statelessClient = new StatelessClient();
        this.supabaseClient = supabaseClient;
    }
    public async Task<TreyUser> GetUserFromContext(HttpContext context)
    {
        var token = GetTokenFromHeader(context);
        var sessionUser = await AuthenticateSession(token);
        if (sessionUser.Id == null)
        {
            throw new UnauthorizedAccessException("No valid session found");
        }

        var user = await GetUserById(sessionUser);
        return user;
    }

    private async Task<TreyUser> GetUserById(User user)
    {
        var supabaseUser = await supabaseClient.From<TreyUserDbObject>().Where(u => u.Id == user.Id).Single() ?? throw new UnauthorizedAccessException("User not found in database");
        return new TreyUser
        {
            Id = Guid.Parse(supabaseUser.Id),
            Username = supabaseUser.Username,
            OrganizationId = supabaseUser.OrganizationId,
            Role = supabaseUser.Role,
            CreatedAt = supabaseUser.CreatedAt,
            UpdatedAt = supabaseUser.UpdatedAt
        };
    }

    public async Task<TreyUser?> FindUserById(string userId)
    {
        var supabaseUser = await supabaseClient.From<TreyUserDbObject>().Where(u => u.Id == userId).Single();
        if (supabaseUser == null)
        {
            return null;
        }
        return new TreyUser
        {
            Id = Guid.Parse(supabaseUser.Id),
            Username = supabaseUser.Username,
            OrganizationId = supabaseUser.OrganizationId,
            Role = supabaseUser.Role,
            CreatedAt = supabaseUser.CreatedAt,
            UpdatedAt = supabaseUser.UpdatedAt
        };
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

    private async Task<User> AuthenticateSession(string sessionJwt)
    {
        try
        {
            var user = await statelessClient.GetUser(sessionJwt, options) ?? throw new UnauthorizedAccessException("No valid session found");
            return user;
        }
        catch (Exception ex)
        {
            throw new UnauthorizedAccessException($"Session validation failed: {ex.Message}");
        }
    }

    public async Task<bool> IsUserAuthorized(TreyUser user, string? organizationId)
    {
        if (user == null)
        {
            return false;
        }
        if (user.Role == TreyRole.Admin || user.Role == TreyRole.TreyBoard)
        {
            return true;
        }
        return organizationId != null && user.OrganizationId == organizationId;
    }
}
