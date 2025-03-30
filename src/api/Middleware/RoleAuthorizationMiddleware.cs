using Trey.Api.Models;
using Trey.Api.Services;

namespace Trey.Api.Middleware;

public class RoleAuthorizationMiddleware(RequestDelegate next, IServiceScopeFactory serviceScopeFactory, ILogger<RoleAuthorizationMiddleware> logger)
{
    public static RequestDelegate Create(RequestDelegate next, IServiceScopeFactory serviceScopeFactory, ILogger<RoleAuthorizationMiddleware> logger)
    {
        var middleware = new RoleAuthorizationMiddleware(next, serviceScopeFactory, logger);
        return middleware.InvokeAsync;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var endpoint = context.GetEndpoint();
        if (endpoint == null)
        {
            await next(context);
            return;
        }

        var requiredRoleAttribute = endpoint.Metadata.GetMetadata<RequiredRoleAttribute>();
        if (requiredRoleAttribute == null)
        {
            await next(context);
            return;
        }

        try
        {
            using (var scope = serviceScopeFactory.CreateScope())
            {
                var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
                var user = await authService.GetUserFromContext(context);
                if (!requiredRoleAttribute.Roles.Contains(user.Role))
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return;
                }
                logger.LogDebug("User {user} has required role {role}", user.Name, user.Role);
            }

            await next(context);
        }
        catch (UnauthorizedAccessException)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        }
    }
} 