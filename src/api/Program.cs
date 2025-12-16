using System.Text.Json;
using System.Text.Json.Serialization;
using Azure.Identity;
using Azure.Storage.Blobs;
using Microsoft.Azure.Cosmos;
using Trey.Api.Extensions;
using Trey.Api.Middleware;
using Trey.Api.Repositories;
using Trey.Api.Services;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Azure.Communication.Email;

var credentialOptions = new DefaultAzureCredentialOptions
{
    ExcludeSharedTokenCacheCredential = true,
    ExcludeVisualStudioCredential = true,
    ExcludeVisualStudioCodeCredential = true,
    ExcludeAzureCliCredential = false,
    ExcludeInteractiveBrowserCredential = true,
    ManagedIdentityClientId = null, // Will automatically use the system-assigned managed identity
    Diagnostics = { IsLoggingEnabled = true, IsAccountIdentifierLoggingEnabled = true, IsDistributedTracingEnabled = true },
};
var credential = new DefaultAzureCredential(credentialOptions);
var builder = WebApplication.CreateBuilder(args);

JsonSerializerOptions options = new()
{
    DefaultIgnoreCondition = JsonIgnoreCondition.Never,
    WriteIndented = true,
    PropertyNameCaseInsensitive = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
};

builder.Services.AddSingleton(_ => new CosmosClient(builder.Configuration["AZURE_COSMOS_ENDPOINT"], credential,
    new CosmosClientOptions
    {
        UseSystemTextJsonSerializerWithOptions = options
    }));

builder.Services.AddSingleton<BlobServiceClient>(_ =>
{
    var blobServiceClient = new BlobServiceClient(
        Uri.TryCreate(builder.Configuration["AZURE_STORAGE_BLOB_ENDPOINT"], UriKind.Absolute, out var uri)
            ? uri
            : throw new ArgumentException("Invalid URI for Azure Storage Blob endpoint"),
        credential);
    return blobServiceClient;
});

builder.Services.AddSingleton<BlobContainerClient>(serviceProvider =>
{
    var blobServiceClient = serviceProvider.GetRequiredService<BlobServiceClient>();

    // TODO: Get container name from environment variable
    var containerClient = blobServiceClient.GetBlobContainerClient("trey");

    containerClient.CreateIfNotExists();

    return containerClient;
});

builder.Services.AddHealthChecks()
    .AddAzureCosmosDB()
    .AddAzureBlobStorage();

builder.Services.AddSingleton<FileService>();
builder.Services.AddSingleton<OrganizationsRepository>();
builder.Services.AddSingleton<SurveyRepository>();
builder.Services.AddSingleton<EmailService>();
builder.Services.AddSingleton<IAuthService, AuthService>();

builder.Services.AddCors();
builder.Services.AddApplicationInsightsTelemetry(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var supabaseUrl = Environment.GetEnvironmentVariable("SUPABASE_URL") ?? throw new ArgumentNullException("SUPABASE_URL");
var supabaseKey = Environment.GetEnvironmentVariable("SUPABASE_KEY") ?? throw new ArgumentNullException("SUPABASE_KEY");
var supabaseOptions = new Supabase.SupabaseOptions
{
    AutoRefreshToken = true,
    AutoConnectRealtime = true
};
builder.Services.AddSingleton<Supabase.Client>(_ => new Supabase.Client(supabaseUrl, supabaseKey, supabaseOptions));

builder.Services.AddTreyAuth();
builder.Services.AddSupabaseClient(builder.Configuration);

var emailClientEndpoint = Environment.GetEnvironmentVariable("ACS_EMAIL_ENDPOINT") ?? throw new ArgumentNullException("ACS_EMAIL_ENDPOINT");
EmailClient emailClient = new EmailClient(new Uri(emailClientEndpoint), credential);
builder.Services.AddSingleton(emailClient);

var app = builder.Build();

app.UseCors(policy =>
{
    var origins = builder.Configuration["API_ALLOW_ORIGINS"];
    policy.WithOrigins(origins ?? "*");
    policy.AllowAnyHeader();
    policy.AllowAnyMethod();
});

// Add role authorization middleware
app.UseMiddleware<RoleAuthorizationMiddleware>();

// Swagger UI
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("./openapi.yaml", "v1");
    options.RoutePrefix = "";
});

app.UseStaticFiles(new StaticFileOptions
{
    // Serve openapi.yaml file
    ServeUnknownFileTypes = true
});

app.MapGroup("/files")
    .MapBlobFileApi()
    .WithOpenApi()
    .DisableAntiforgery(); // FIXME - remove this line when antiforgery is implemented

app.MapGroup("/organizations")
    .MapOrganizationApi()
    .WithOpenApi()
    .DisableAntiforgery(); // FIXME - remove this line when antiforgery is implemented

app.MapGroup("/surveys")
    .MapSurveyEndpoints()
    .WithOpenApi()
    .DisableAntiforgery(); // FIXME - remove this line when antiforgery is implemented

app.MapGroup("/auth")
    .MapAuthApi()
    .WithOpenApi()
    .DisableAntiforgery(); // FIXME - remove this line when antiforgery is implemented

app.UseHealthChecks("/health",
    new HealthCheckOptions
    {
        ResponseWriter = async (context, report) =>
        {
            var result = JsonSerializer.Serialize(
              new
              {
                  status = report.Status.ToString(),
                  duration = $"{report.TotalDuration.TotalMilliseconds} ms",
                  errors = report.Entries.Where(e => e.Value.Status != HealthStatus.Healthy).Select(e => new
                  {
                      service = e.Key,
                      status = Enum.GetName(typeof(HealthStatus), e.Value.Status),
                      duration = $"{e.Value.Duration.TotalMilliseconds} ms",
                      description = e.Value.Exception?.Message ?? e.Value.Description
                  }),
                  services = report.Entries.Select(e => new
                  {
                      service = e.Key,
                      status = Enum.GetName(typeof(HealthStatus), e.Value.Status),
                      duration = $"{e.Value.Duration.TotalMilliseconds} ms"
                  })
              }
            );
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(result);
        }
    }
);


app.Run();
