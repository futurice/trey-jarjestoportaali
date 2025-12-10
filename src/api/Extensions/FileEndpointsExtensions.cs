using Microsoft.AspNetCore.Mvc;
using Trey.Api.Models;
using Trey.Api.Services;

namespace Trey.Api.Extensions;

public static class FileEndpointsExtensions
{
    public static RouteGroupBuilder MapBlobFileApi(this RouteGroupBuilder group)
    {
        group.MapPost("/", CreateFile);
        group.MapGet("/", GetFiles);
        group.MapGet("/organization", GetFilesByOrganization);
        group.MapGet("/file/{fileName}", GetFileByName);
        group.MapDelete("/file", DeleteFile);
        return group;
    }

    private static async Task<IResult> CreateFile([FromForm] IFormFileCollection files,
        [FromServices] FileService service,
        [FromServices] ILogger<FileService> logger,
        [FromServices] IAuthService auth,
        HttpContext context,
        CancellationToken cancellationToken)
    {
        var user = await auth.GetUserFromContext(context);
        logger.LogInformation("Upload files to {container}", service);

        var response = await service.UploadFilesAsync(files, user, cancellationToken);

        logger.LogInformation("Uploaded files: {x}", response);

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

    private static async Task<IResult> GetFilesByOrganization([FromQuery] Guid organizationId,
        [FromServices] FileService service,
        [FromServices] ILogger<FileService> logger,
        [FromServices] IAuthService auth,
        HttpContext context,
        CancellationToken cancellationToken)
    {
        logger.LogDebug("Finding files for organization {organizationId} from {container}", organizationId, service);
        var user = await auth.GetUserFromContext(context);
        if (user.Role != TreyRole.Admin && user.Role != TreyRole.TreyBoard && user.OrganizationId != organizationId.ToString())
        {
            logger.LogWarning("User {userId} is not authorized to access files for organization {organizationId} from {container}", user.Id, organizationId, service);
            return TypedResults.Forbid();
        }
        var response = await service.GetFilesByOrganizationAsync(auth, organizationId, cancellationToken);

        logger.LogDebug("Found files: {x}", response);

        return await Task.FromResult<IResult>(TypedResults.Ok(response));
    }

    private static async Task<IResult> GetFileByName([FromRoute] string fileName,
        [FromServices] FileService service,
        [FromServices] ILogger<FileService> logger,
        [FromServices] IAuthService auth,
        HttpContext context,
        CancellationToken cancellationToken)
    {
        logger.LogDebug("Getting file {fileName} from {container}", fileName, service);
        var user = await auth.GetUserFromContext(context);
        var folderName = user?.OrganizationId?.ToString() ?? "unknown";
        var blobPath = $"{folderName}/{fileName}";
        var response = await service.GetFileContentByNameAsync(blobPath, cancellationToken);
        if (response is null)
        {
            return TypedResults.NotFound();
        }

        logger.LogDebug("Found file: {x}", response);

        var bytes = response.Content.ToArray();
        var contentType = response.Details.ContentType ?? "application/octet-stream";
        return Results.File(bytes, contentType, fileName);
    }

    private static async Task<IResult> DeleteFile([FromQuery] string fileId,
        [FromServices] FileService service,
        [FromServices] ILogger<FileService> logger,
        [FromServices] IAuthService auth,
        HttpContext context,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting file {fileId} from {container}", fileId, service);
        var user = await auth.GetUserFromContext(context);
        var organizationId = Path.GetDirectoryName(fileId);
        if (user.Role != TreyRole.Admin && user.OrganizationId != organizationId)
        {
            logger.LogWarning("User {userId} is not authorized to delete file {fileId} from {container}", user.Id, fileId, service);
            return TypedResults.Forbid();
        }

        var deleted = await service.DeleteFileByIdAsync(fileId, cancellationToken);
        if (!deleted)
        {
            logger.LogWarning("File {fileId} not found in {container}", fileId, service);
            return TypedResults.NotFound();
        }

        logger.LogInformation("Deleted file {fileId} from {container}", fileId, service);
        return TypedResults.NoContent();
    }
}
