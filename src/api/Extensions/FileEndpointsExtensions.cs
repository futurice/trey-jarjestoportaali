using Microsoft.AspNetCore.Mvc;
using Trey.Api.Services;

namespace Trey.Api.Extensions;

public static class FileEndpointsExtensions
{
    public static RouteGroupBuilder MapBlobFileApi(this RouteGroupBuilder group)
    {
        group.MapPost("/", CreateFile);
        group.MapGet("/", GetFiles);
        group.MapGet("/{fileId}", GetFile);
        return group;
    }

    private static async Task<IResult> CreateFile([FromForm] IFormFileCollection files,
        [FromServices] FileService service,
        [FromServices] ILogger<FileService> logger,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Upload files to {container}", service);

        var response = await service.UploadFilesAsync(files, cancellationToken);

        logger.LogInformation("Uploaded files: {x}", response);

        return TypedResults.Ok(response);
    }

    private static async Task<IResult> GetFile(string fileId,
        [FromServices] FileService service,
        [FromServices] ILogger<FileService> logger)
    {
        logger.LogDebug("Finding file {fileId} from {container}", fileId, service);
        var response = await service.CreateSasUri(fileId);
        logger.LogDebug("Found file: {fileId}", fileId);
        return TypedResults.Ok(response);
    }

    private static Task<IResult> GetFiles([FromServices] FileService service,
        [FromServices] ILogger<FileService> logger,
        CancellationToken cancellationToken)
    {
        logger.LogDebug("Finding files from {container}", service);

        var response = service.FindFilesAsync(cancellationToken);

        logger.LogDebug("Found files: {x}", response);

        return Task.FromResult<IResult>(TypedResults.Ok(response));
    }
}