using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using Azure.Communication.Email;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Supabase.Gotrue;
using Supabase.Gotrue.Exceptions;
using Trey.Api.Models;
using static Supabase.Gotrue.StatelessClient;

namespace Trey.Api.Services;

public interface IAuthService
{
    Task<TreyUser> GetUserFromContext(HttpContext context);
    Task<TreyUser> FindUserById(string userId);
    Task<bool> IsUserAuthorized(TreyUser user, string? organizationId);
    Task<TreyUser> CreateUser(CreateTreyUserRequest request);
    Task<TreyUser[]> CreateMultipleUsers(CreateTreyUserRequest[] request);
    Task<Session> LoginUser(string username, string password);
    Task<string?> GetEmailForUsername(string username);
}

internal sealed class AuthService : IAuthService
{
    private readonly StatelessClient statelessClient;
    private readonly Supabase.Client supabaseClient;
    private readonly StatelessClientOptions options;
    private readonly EmailService emailService;
    private readonly ILogger<AuthService> _logger;
    private readonly string supabaseUrl;
    private readonly IMemoryCache _memoryCache;

    public AuthService(Supabase.Client supabaseClient, EmailService emailService, ILogger<AuthService> logger, IMemoryCache memoryCache)
    {
        supabaseUrl = Environment.GetEnvironmentVariable("SUPABASE_URL") ?? throw new ArgumentNullException("SUPABASE_URL");
        options = new StatelessClientOptions
        {
            Url = $"{supabaseUrl}/auth/v1",
            Headers =
            {
                { "apiKey", Environment.GetEnvironmentVariable("SUPABASE_SECRET_KEY") ?? throw new ArgumentNullException("SUPABASE_SECRET_KEY") }
            }
        };
        statelessClient = new StatelessClient();
        this.supabaseClient = supabaseClient;
        this.emailService = emailService;
        _logger = logger;
        _memoryCache = memoryCache;
    }
    public async Task<TreyUser> GetUserFromContext(HttpContext context)
    {
        var token = GetTokenFromHeader(context);
        var userId = await AuthenticateToken(token) ?? throw new UnauthorizedAccessException("No valid session found");
        var user = await FindUserById(userId);
        return user;
    }

    private async Task<TreyUser> GetUserById(User user)
    {
        var userResponse = await supabaseClient.From<TreyUserDbObject>().Where(u => u.Id == user.Id).Get();
        var supabaseUser = userResponse.Models.FirstOrDefault() ?? throw new UnauthorizedAccessException("User not found in database");
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

    public async Task<TreyUser> FindUserById(string userId)
    {
        var userResponse = await supabaseClient.From<TreyUserDbObject>().Where(u => u.Id == userId).Get();
        var supabaseUser = userResponse.Models.FirstOrDefault() ?? throw new UnauthorizedAccessException("User not found in database");
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

    private async Task<JsonWebKeySet> GetWellKnownJwks()
    {
        if (!_memoryCache.TryGetValue("JWKS", out JsonWebKeySet? jwksFromCache) || jwksFromCache == null)
        {
            var jwks = await FetchJwksFromAuthServer();
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(2));
            _memoryCache.Set("JWKS", jwks, cacheEntryOptions);
            return jwks;
        }
        return jwksFromCache;
    }

    private async Task<JsonWebKeySet> FetchJwksFromAuthServer()
    {
        using var client = new HttpClient();
        var response = await client.GetAsync($"{supabaseUrl}/auth/v1/.well-known/jwks.json");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<JsonWebKeySet>() ?? throw new Exception("Failed to retrieve JWKS");
    }

    private async Task<string?> AuthenticateToken(string sessionJwt)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwks = await GetWellKnownJwks();
            var parameters = new TokenValidationParameters
            {
                ValidAudience = "authenticated",
                ValidIssuer = $"{supabaseUrl}/auth/v1",
                ValidateLifetime = false,
                IssuerSigningKeys = jwks.Keys
            };
            tokenHandler.ValidateToken(sessionJwt, parameters, out var validatedToken);
            return ((JwtSecurityToken)validatedToken).Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Token validation failed");
            var payload = new JwtSecurityTokenHandler().ReadJwtToken(sessionJwt).Payload;
            payload.TryGetValue("sub", out var sub);
            payload.TryGetValue("iss", out var iss);
            if (sub == null || iss == null || iss.ToString() != $"{supabaseUrl}/auth/v1")
                return null;
            return sub.ToString();
        }
    }

    /* private async Task<User> AuthenticateSession(string sessionJwt)
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
    } */

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

    public async Task<Session> LoginUser(string username, string password)
    {
        try
        {
            string? userEmail = await GetEmailForUsername(username) ?? throw new UnauthorizedAccessException("Invalid username or password");
            var loginResponse = await statelessClient.SignIn(userEmail, password, options);
            if (loginResponse?.User == null) throw new UnauthorizedAccessException("Invalid username or password");
            return loginResponse;
        }
        catch (Exception ex) when (ex is not UnauthorizedAccessException && ex is GotrueException gEx && gEx.StatusCode != 400 && gEx.StatusCode != 401)
        {
            _logger.LogError(ex, $"Error logging in user {username}");
            throw;
        }
    }

    /// <summary>
    /// Retrieves the email address associated with a given username using Supabase RPC.
    /// If the provided username is already a valid email address, it is returned directly.
    /// If the username is empty or no email is found, returns <c>null</c>.
    /// </summary>
    /// <param name="supabase">The Supabase client instance used to perform the RPC call.</param>
    /// <param name="username">The username for which to retrieve the associated email address.</param>
    /// <returns>
    /// A <see cref="Task{TResult}"/> representing the asynchronous operation. The task result contains the email address as a string if found; otherwise, <c>null</c>.
    /// </returns>
    public async Task<string?> GetEmailForUsername(string username)
    {
        try
        {
            var email = new EmailAddressAttribute();
            if (email.IsValid(username)) return username;
            else if (string.IsNullOrEmpty(username)) return null;

            // The 'email_for_username' RPC function retrieves the email address associated with the given username from the database.
            var userEmailResponse = await supabaseClient.Rpc("email_for_username", new { p_username = username });
            var userEmail = JsonConvert.DeserializeObject<string>(userEmailResponse?.Content?.ToString() ?? "");
            if (userEmailResponse?.Content == null || userEmailResponse.ResponseMessage?.StatusCode == HttpStatusCode.NotFound || userEmail == null) return null;
            return userEmail;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Exception while retrieving email for username {username}");
            return null;
        }
    }
}
