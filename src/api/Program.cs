using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Azure.Identity;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Azure.Cosmos;
using Microsoft.IdentityModel.Tokens;
using Trey.Api.Endpoints;
using Trey.Api.Extensions;
using Trey.Api.Middleware;
using Trey.Api.Repositories;
using Trey.Api.Services;

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

builder.Services.AddSingleton<FileService>();
builder.Services.AddSingleton<OrganizationsRepository>();
builder.Services.AddSingleton<SurveyRepository>();
builder.Services.AddSingleton<UsersRepository>();
builder.Services.AddSingleton<IAuthService, AuthService>();

builder.Services.AddCors();
builder.Services.AddApplicationInsightsTelemetry(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWT_ISSUER"],
            ValidAudience = builder.Configuration["JWT_AUDIENCE"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JWT_SECRET"] ?? throw new ArgumentNullException("JWT_SECRET")))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors(policy =>
{
    var origins = builder.Configuration["API_ALLOW_ORIGINS"];
    policy.WithOrigins(origins ?? "*");
    policy.AllowAnyHeader();
    policy.AllowAnyMethod();
});

// Add authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

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

app.MapAuthEndpoints();

app.Run();