using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Trey.Api.Services;

namespace Trey.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/auth")
            .WithTags("Authentication")
            .WithOpenApi();

        group.MapPost("/login", async (
            [FromBody] LoginRequest request,
            IAuthService authService) =>
        {
            var (success, token) = await authService.AuthenticateUserAsync(request.Username, request.Password);
            if (!success)
            {
                return Results.Unauthorized();
            }

            return Results.Ok(new { token });
        });

        group.MapPost("/register", async (
            [FromBody] RegisterRequest request,
            IAuthService authService) =>
        {
            var (success, message) = await authService.RegisterUserAsync(
                request.Username,
                request.Password,
                request.Email,
                request.Role ?? "User");

            if (!success)
            {
                return Results.BadRequest(new { message });
            }

            return Results.Ok(new { message });
        });

        group.MapPost("/reset-password-request", async (
            [FromBody] ResetPasswordRequest request,
            IAuthService authService) =>
        {
            var (success, message) = await authService.RequestPasswordResetAsync(request.Email);
            if (!success)
            {
                return Results.BadRequest(new { message });
            }

            return Results.Ok(new { message = "Password reset instructions sent to your email" });
        });

        group.MapPost("/reset-password", async (
            [FromBody] ResetPasswordConfirmRequest request,
            IAuthService authService) =>
        {
            var (success, message) = await authService.ResetPasswordAsync(request.Token, request.NewPassword);
            if (!success)
            {
                return Results.BadRequest(new { message });
            }

            return Results.Ok(new { message });
        });

        group.MapPost("/verify-email", async (
            [FromBody] VerifyEmailRequest request,
            IAuthService authService) =>
        {
            try
            {
                await authService.VerifyEmailAsync(request.Token);
                return Results.Ok(new { message = "Email verified successfully" });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("VerifyEmail")
        .WithOpenApi();

        group.MapPost("/resend-verification", async (
            [FromBody] ResendVerificationRequest request,
            IAuthService authService) =>
        {
            var (success, message) = await authService.ResendVerificationEmailAsync(request.Email);
            if (!success)
            {
                return Results.BadRequest(new { message });
            }

            return Results.Ok(new { message });
        });

        group.MapPut("/users/{userId}/role", [Authorize(Roles = "Admin")] async (
            string userId,
            [FromBody] UpdateRoleRequest request,
            IAuthService authService) =>
        {
            var (success, message) = await authService.UpdateUserRoleAsync(userId, request.Role);
            if (!success)
            {
                return Results.BadRequest(new { message });
            }

            return Results.Ok(new { message });
        });
    }
}

public record LoginRequest(string Username, string Password);
public record RegisterRequest(string Username, string Password, string Email, string? Role);
public record ResetPasswordRequest(string Email);
public record ResetPasswordConfirmRequest(string Token, string NewPassword);
public record UpdateRoleRequest(string Role);
public record VerifyEmailRequest(string Token);
public record ResendVerificationRequest(string Email); 