using Trey.Api.Models;
using Trey.Api.Services;

namespace Trey.Api.Middleware;

public class RoleAuthorizationMiddleware(RequestDelegate next, IAuthService authService)
{
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
            var user = await authService.GetUserFromContext(context);
            if (user.Role != requiredRoleAttribute.Role)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return;
            }

            await next(context);
        }
        catch (UnauthorizedAccessException)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        }
    }
} 