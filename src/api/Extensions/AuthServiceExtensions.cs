using Trey.Api.Services;

namespace Trey.Api.Extensions;

public static class AuthServiceExtensions
{
    public static IServiceCollection AddSupabaseClient(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<Supabase.Gotrue.Client>(_ =>
        {
            var url = configuration["SUPABASE_URL"] ?? throw new ArgumentNullException("SUPABASE_URL");
            var key = configuration["SUPABASE_SECRET_KEY"] ?? throw new ArgumentNullException("SUPABASE_SECRET_KEY");
            var options = new Supabase.Gotrue.ClientOptions
            {
                Headers = new Dictionary<string, string>
                {
                    { "apiKey", key }
                },
                Url = url,
                AutoRefreshToken = false,
            };
            return new Supabase.Gotrue.Client(options);
        });

        return services;
    }
}
