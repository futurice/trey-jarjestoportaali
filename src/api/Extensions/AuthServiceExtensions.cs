using Trey.Api.Services;

namespace Trey.Api.Extensions;

public static class AuthServiceExtensions
{
    public static IServiceCollection AddTreyAuth(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        return services;
    }

    public static IServiceCollection AddSupabaseClient(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<Supabase.Gotrue.Client>(_ =>
        {
            var url = configuration["SUPABASE_URL"] ?? throw new ArgumentNullException("SUPABASE_URL");
            var key = configuration["SUPABASE_KEY"] ?? throw new ArgumentNullException("SUPABASE_KEY");
            var options = new Supabase.Gotrue.ClientOptions
            {
                Url = url,
                AutoRefreshToken = true,
            };
            return new Supabase.Gotrue.Client(options);
        });

        return services;
    }
}
