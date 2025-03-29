using Trey.Api.Models;
using Trey.Api.Services;

namespace Trey.Api.Middleware;

public class RoleAuthorizationMiddleware(RequestDelegate next, IServiceScopeFactory serviceScopeFactory)
{
    public static RequestDelegate Create(RequestDelegate next, IServiceScopeFactory serviceScopeFactory)
    {
        var middleware = new RoleAuthorizationMiddleware(next, serviceScopeFactory);
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
                if (user.Role != requiredRoleAttribute.Role)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return;
                }
            }

            await next(context);
        }
        catch (UnauthorizedAccessException)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        }
    }
} 