using Azure.Identity;
using Azure.Storage.Blobs;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;
using Stytch.net.Clients;
using Trey.Api;
using Trey.Api.Extensions;
using Trey.Api.Repositories;
using Trey.Api.Services;

var credential = new DefaultAzureCredential();
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton(_ => new CosmosClient(builder.Configuration["AZURE_COSMOS_ENDPOINT"], credential,
    new CosmosClientOptions
    {
        SerializerOptions = new CosmosSerializationOptions
        {
            PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
        }
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

builder.Services.AddSingleton<ConsumerClient>(client =>
{
    var projectId = builder.Configuration["STYTCH_PROJECT_ID"];
    var projectSecret = builder.Configuration["STYTCH_PROJECT_SECRET"];
    return new ConsumerClient(new ClientConfig
    {
        ProjectId = projectId,
        ProjectSecret = projectSecret
    });
});

builder.Services.AddSingleton<FileService>();
builder.Services.AddSingleton<OrganizationsRepository>();
builder.Services.AddSingleton<UserService>();

builder.Services.AddCors();
builder.Services.AddApplicationInsightsTelemetry(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();

app.UseCors(policy =>
{
    var origins = builder.Configuration["API_ALLOW_ORIGINS"];
    policy.WithOrigins(origins ?? "*");
    policy.AllowAnyHeader();
    policy.AllowAnyMethod();
});

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

app.MapGroup("/users")
    .MapUserApi()
    .WithOpenApi()
    .DisableAntiforgery(); // FIXME - remove this line when antiforgery is implemented

app.Run();