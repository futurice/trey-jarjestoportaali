using Stytch.net.Clients;
using Trey.Api.Services;

namespace Trey.Api.Extensions;

public static class AuthServiceExtensions
{
    public static IServiceCollection AddTreyAuth(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        return services;
    }

    public static IServiceCollection AddStytchClient(this IServiceCollection services,  IConfiguration configuration)
    {
        services.AddScoped<ConsumerClient>(_ =>
        {
            var projectId = configuration["STYTCH_PROJECT_ID"] ?? throw new ArgumentNullException("STYTCH_PROJECT_ID");
            var projectSecret = configuration["STYTCH_PROJECT_SECRET"] ??
                                throw new ArgumentNullException("STYTCH_PROJECT_SECRET");

            return new ConsumerClient(new ClientConfig
            {
                ProjectId = projectId,
                ProjectSecret = projectSecret
            });
        });
        return services;
    }
}