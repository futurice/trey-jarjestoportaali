using Azure.Communication.Email;
using Supabase.Gotrue;
using Trey.Api.Models;
using static Supabase.Gotrue.StatelessClient;

namespace Trey.Api.Services;

public interface IAuthService
{
    Task<TreyUser> GetUserFromContext(HttpContext context);
    Task<TreyUser?> FindUserById(string userId);
    Task<bool> IsUserAuthorized(TreyUser user, string? organizationId);
    Task<TreyUser> CreateUser(CreateTreyUserRequest request);
    Task<TreyUser[]> CreateMultipleUsers(CreateTreyUserRequest[] request);
}

internal sealed class AuthService : IAuthService
{
    private readonly StatelessClient statelessClient;
    private readonly Supabase.Client supabaseClient;
    private readonly StatelessClientOptions options;
    private readonly EmailService emailService;
    public AuthService(Supabase.Client supabaseClient, EmailService emailService)
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
        this.emailService = emailService;
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

    public async Task<TreyUser[]> CreateMultipleUsers(CreateTreyUserRequest[] request)
    {
        var tasks = new List<Task<TreyUser>>();
        foreach (var userRequest in request)
        {
            tasks.Add(CreateUser(userRequest));
        }
        var users = await Task.WhenAll(tasks);
        return users.Where(u => u != null).ToArray();
    }
    public async Task<TreyUser> CreateUser(CreateTreyUserRequest request)
    {
        var userPassword = request.Password ?? GeneratePassword(12);
        var userRole = request.Role.ToTreyRole();
        var treyOptions = new SignUpOptions
        {
            Data = new Dictionary<string, object>
            {
                { "username", request.Username },
                { "organization_id", request.OrganizationId ?? string.Empty },
                { "trey_role", userRole.ToString() ?? (request.OrganizationId != null ? TreyRole.Organization.ToString() : TreyRole.None.ToString()) }
            }
        };
        var session = await supabaseClient.Auth.SignUp(request.Email, userPassword, treyOptions);
        if (session?.User == null || session.User.Id == null)
        {
            Console.WriteLine($"Error: Failed to create user {request.Email}");
            return null!;
        }
        var emailResponse = await emailService.SendAccountCreatedEmail(request.Email, request.Username, userPassword);
        if (emailResponse.Value.Status != EmailSendStatus.Succeeded)
        {
            Console.WriteLine("Warning: Failed to send account created email to user " + request.Email);
        }
        return await GetUserById(session.User);
    }

    private static string GeneratePassword(int length)
    {
        const string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()?_-";
        var random = new Random();
        return new string(Enumerable.Repeat(validChars, length)
            .Select(s => s[random.Next(s.Length)]).ToArray());
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
