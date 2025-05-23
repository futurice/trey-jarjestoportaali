using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Trey.Api.Models;
using Trey.Api.Repositories;
using Trey.Api.Services;

namespace Trey.Api.Services;

/// <summary>
/// Interface for authentication and user management services.  
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Authenticates a user with the provided username and password.
    /// </summary>
    /// <param name="username">The username to authenticate.</param>
    /// <param name="password">The password to authenticate with.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A tuple containing success status and JWT token if successful.</returns>
    Task<(bool success, string? token)> AuthenticateUserAsync(string username, string password, CancellationToken cancellationToken = default);

    /// <summary>
    /// Registers a new user with the provided information.
    /// </summary>
    /// <param name="username">The username for the new user.</param>
    /// <param name="email">The email address for the new user.</param>
    /// <param name="password">The password for the new user.</param>
    /// <param name="role">The role to assign to the new user.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A tuple containing success status and message.</returns>
    Task<(bool success, string? message)> RegisterUserAsync(string username, string email, string password, string role, CancellationToken cancellationToken = default);

    /// <summary>
    /// Requests a password reset for the user with the provided email.
    /// </summary>
    /// <param name="email">The email address of the user.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A tuple containing success status and message.</returns>
    Task<(bool success, string? message)> RequestPasswordResetAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Resets a user's password using the provided token.
    /// </summary>
    /// <param name="token">The reset token.</param>
    /// <param name="newPassword">The new password to set.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A tuple containing success status and message.</returns>
    Task<(bool success, string? message)> ResetPasswordAsync(string token, string newPassword, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates a user's role.
    /// </summary>
    /// <param name="userId">The ID of the user to update.</param>
    /// <param name="newRole">The new role to assign.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A tuple containing success status and message.</returns>
    Task<(bool success, string? message)> UpdateUserRoleAsync(string userId, string newRole, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the user information from the current HTTP context.
    /// </summary>
    /// <param name="context">The HTTP context.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The user information if found, null otherwise.</returns>
    Task<TreyUser?> GetUserFromContext(HttpContext context, CancellationToken cancellationToken = default);

    /// <summary>
    /// Verifies a user's email using the provided token.
    /// </summary>
    /// <param name="token">The verification token.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <exception cref="InvalidOperationException">Thrown when the token is invalid or email is already verified.</exception>
    Task VerifyEmailAsync(string token, CancellationToken cancellationToken = default);

    /// <summary>
    /// Resends the verification email to the user.
    /// </summary>
    /// <param name="email">The email address of the user.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A tuple containing success status and message.</returns>
    Task<(bool success, string? message)> ResendVerificationEmailAsync(string email, CancellationToken cancellationToken = default);
}

/// <summary>
/// Implementation of the authentication service.
/// </summary>
public class AuthService : IAuthService
{
    private readonly UsersRepository _usersRepository;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;
    private readonly string _jwtSecret;
    private readonly string _jwtIssuer;
    private readonly string _jwtAudience;

    /// <summary>
    /// Initializes a new instance of the <see cref="AuthService"/> class.
    /// </summary>
    /// <param name="usersRepository">The users repository.</param>
    /// <param name="configuration">The configuration.</param>
    /// <param name="emailService">The email service.</param>
    /// <exception cref="ArgumentNullException">Thrown when any of the parameters are null.</exception>
    public AuthService(
        UsersRepository usersRepository,
        IConfiguration configuration,
        IEmailService emailService)
    {
        _usersRepository = usersRepository ?? throw new ArgumentNullException(nameof(usersRepository));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
        _jwtSecret = configuration["JWT_SECRET"] ?? throw new ArgumentNullException(nameof(configuration), "JWT_SECRET configuration is missing");
        _jwtIssuer = configuration["JWT_ISSUER"] ?? throw new ArgumentNullException(nameof(configuration), "JWT_ISSUER configuration is missing");
        _jwtAudience = configuration["JWT_AUDIENCE"] ?? throw new ArgumentNullException(nameof(configuration), "JWT_AUDIENCE configuration is missing");
    }

    /// <inheritdoc/>
    public async Task<(bool success, string? token)> AuthenticateUserAsync(string username, string password, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(username);
        ArgumentNullException.ThrowIfNull(password);

        var user = await _usersRepository.GetUserByUsernameAsync(username);
        if (user == null)
        {
            return (false, null);
        }

        if (!VerifyPassword(password, user.PasswordHash))
        {
            return (false, null);
        }

        if (!user.EmailVerified)
        {
            return (false, "Email not verified");
        }

        var token = GenerateJwtToken(user);
        return (true, token);
    }

    /// <inheritdoc/>
    public async Task<(bool success, string? message)> RegisterUserAsync(string username, string email, string password, string role, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(username);
        ArgumentNullException.ThrowIfNull(email);
        ArgumentNullException.ThrowIfNull(password);
        ArgumentNullException.ThrowIfNull(role);

        // Check if username or email already exists
        var existingUser = await _usersRepository.GetUserByUsernameAsync(username) 
            ?? await _usersRepository.GetUserByEmailAsync(email);

        if (existingUser != null)
        {
            return (false, "Username or email already exists");
        }

        var verificationToken = GenerateVerificationToken();
        var user = new Trey.Api.Models.User
        {
            Username = username,
            Email = email,
            PasswordHash = HashPassword(password),
            Role = role.ToTreyRole(),
            EmailVerified = false,
            VerificationToken = verificationToken
        };

        await _usersRepository.CreateUserAsync(user);
        await _emailService.SendVerificationEmailAsync(email, verificationToken);

        return (true, "Registration successful. Please check your email to verify your account.");
    }

    /// <inheritdoc/>
    public async Task<(bool success, string? message)> RequestPasswordResetAsync(string email, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(email);

        var user = await _usersRepository.GetUserByEmailAsync(email);
        if (user == null)
        {
            return (false, "User not found");
        }

        var resetToken = GenerateResetToken();
        user.ResetToken = resetToken;
        user.ResetTokenExpiry = DateTime.UtcNow.AddHours(24);
        await _usersRepository.UpdateUserAsync(user);

        await _emailService.SendPasswordResetEmailAsync(email, resetToken);
        return (true, "Password reset instructions have been sent to your email.");
    }

    /// <inheritdoc/>
    public async Task<(bool success, string? message)> ResetPasswordAsync(string token, string newPassword, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(token);
        ArgumentNullException.ThrowIfNull(newPassword);

        var user = await _usersRepository.GetUserByResetTokenAsync(token);
        if (user == null || user.ResetTokenExpiry < DateTime.UtcNow)
        {
            return (false, "Invalid or expired reset token");
        }

        user.PasswordHash = HashPassword(newPassword);
        user.ResetToken = null;
        user.ResetTokenExpiry = null;
        await _usersRepository.UpdateUserAsync(user);

        return (true, "Password reset successful");
    }

    /// <inheritdoc/>
    public async Task<(bool success, string? message)> UpdateUserRoleAsync(string userId, string newRole, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(userId);
        ArgumentNullException.ThrowIfNull(newRole);

        var user = await _usersRepository.GetUserByUsernameAsync(userId);
        if (user == null)
        {
            return (false, "User not found");
        }

        user.Role = newRole.ToTreyRole();
        await _usersRepository.UpdateUserAsync(user);
        return (true, "Role updated successfully");
    }

    /// <inheritdoc/>
    public async Task<TreyUser?> GetUserFromContext(HttpContext context, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(context);

        var token = GetTokenFromHeader(context);
        if (string.IsNullOrEmpty(token))
        {
            return null;
        }

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _jwtIssuer,
                ValidateAudience = true,
                ValidAudience = _jwtAudience,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userId = jwtToken.Claims.First(x => x.Type == "nameid").Value;

            var user = await _usersRepository.GetUserByUsernameAsync(userId);
            if (user == null)
            {
                return null;
            }

            return new TreyUser
            {
                Name = user.Username,
                Role = user.Role,
                OrganizationId = user.Id
            };
        }
        catch
        {
            return null;
        }
    }

    /// <inheritdoc/>
    public async Task VerifyEmailAsync(string token, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(token);

        var user = await _usersRepository.GetUserByVerificationTokenAsync(token);
        if (user == null)
        {
            throw new InvalidOperationException("Invalid verification token");
        }

        if (user.EmailVerified)
        {
            throw new InvalidOperationException("Email already verified");
        }

        user.EmailVerified = true;
        user.VerificationToken = null;
        await _usersRepository.UpdateUserAsync(user);
    }

    /// <inheritdoc/>
    public async Task<(bool success, string? message)> ResendVerificationEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(email);

        var user = await _usersRepository.GetUserByEmailAsync(email);
        if (user == null)
        {
            return (false, "User not found");
        }

        if (user.EmailVerified)
        {
            return (false, "Email is already verified");
        }

        // Generate a new verification token
        user.VerificationToken = GenerateVerificationToken();
        await _usersRepository.UpdateUserAsync(user);

        // Send new verification email
        await _emailService.SendVerificationEmailAsync(email, user.VerificationToken);
        return (true, "Verification email has been resent. Please check your inbox.");
    }

    private string GenerateJwtToken(User user)
    {
        ArgumentNullException.ThrowIfNull(user);

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtSecret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = _jwtIssuer,
            Audience = _jwtAudience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private string HashPassword(string password)
    {
        ArgumentNullException.ThrowIfNull(password);

        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    private bool VerifyPassword(string password, string hash)
    {
        ArgumentNullException.ThrowIfNull(password);
        ArgumentNullException.ThrowIfNull(hash);

        var hashedPassword = HashPassword(password);
        return hashedPassword == hash;
    }

    private string GenerateResetToken()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
    }

    private string GenerateVerificationToken()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
    }

    private static string GetTokenFromHeader(HttpContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return string.Empty;
        }

        return authHeader.Substring("Bearer ".Length);
    }
}