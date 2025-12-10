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
        group.MapGet("/file", GetFileByName);
        group.MapDelete("/file", DeleteFile);
        group.MapGet("/file/details", GetFileDetailsByName);
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

    private static async Task<IResult> GetFiles([FromServices] FileService service,
        [FromServices] ILogger<FileService> logger,
        [FromServices] IAuthService auth,
        HttpContext context,
        CancellationToken cancellationToken)
    {
        logger.LogDebug("Finding files from {container}", service);
        var user = await auth.GetUserFromContext(context);
        if (!await auth.IsUserAuthorized(user, null))
        {
            logger.LogWarning("User {userId} is not authorized to access files from {container}", user.Id, service);
            return TypedResults.Forbid();
        }

        var response = await service.FindFilesAsync(cancellationToken);
        logger.LogDebug("Found files: {x}", response);

        return response.Count == 0
            ? TypedResults.NoContent()
            : TypedResults.Ok(response);
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
        if (!await auth.IsUserAuthorized(user, organizationId.ToString()))
        {
            logger.LogWarning("User {userId} is not authorized to access files for organization {organizationId} from {container}", user.Id, organizationId, service);
            return TypedResults.Forbid();
        }
        var response = await service.GetFilesByOrganizationAsync(auth, organizationId, cancellationToken);

        logger.LogDebug("Found files: {x}", response);

        return TypedResults.Ok(response);
    }

    private static async Task<IResult> GetFileDetailsByName([FromQuery] string id,
        [FromServices] FileService service,
        [FromServices] ILogger<FileService> logger,
        [FromServices] IAuthService auth,
        HttpContext context,
        CancellationToken cancellationToken)
    {
        logger.LogDebug("Getting file {id} from {container}", id, service);
        var user = await auth.GetUserFromContext(context);
        // Explicitly parse organization ID from id (expected format: "orgId/fileName")
        string organizationId = null;
        if (!string.IsNullOrEmpty(id))
        {
            var separatorIndex = id.IndexOfAny(new[] { '/', '\\' });
            if (separatorIndex > 0)
            {
                organizationId = id.Substring(0, separatorIndex);
            }
        }
        if (string.IsNullOrEmpty(organizationId) || !await auth.IsUserAuthorized(user, organizationId))
        {
            logger.LogWarning("User {userId} is not authorized to access file {id} from {container}", user.Id, id, service);
            return TypedResults.Forbid();
        }

        var response = await service.GetFileByNameAsync(id, auth, cancellationToken);
        if (response is null)
        {
            return TypedResults.NotFound();
        }

        logger.LogDebug("Found file: {x}", response);
        return Results.Ok(response);
    }

    private static async Task<IResult> GetFileByName([FromQuery] string fileId,
        [FromServices] FileService service,
        [FromServices] ILogger<FileService> logger,
        [FromServices] IAuthService auth,
        HttpContext context,
        CancellationToken cancellationToken)
    {
        logger.LogDebug("Getting file {fileId} from {container}", fileId, service);
        var user = await auth.GetUserFromContext(context);
        if (!await auth.IsUserAuthorized(user, Path.GetDirectoryName(fileId)))
        {
            logger.LogWarning("User {userId} is not authorized to access file {id} from {container}", user.Id, fileId, service);
            return TypedResults.Forbid();
        }

        var response = await service.GetFileContentByNameAsync(fileId, cancellationToken);
        if (response is null)
        {
            return TypedResults.NotFound();
        }

        logger.LogDebug("Found file: {x}", response);
        var bytes = response.Content.ToArray();
        var contentType = response.Details.ContentType ?? "application/octet-stream";
        return Results.File(bytes, contentType, fileId);
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
        if (!await auth.IsUserAuthorized(user, organizationId))
        {
            logger.LogWarning("User {userId} is not authorized to access files for organization {organizationId} from {container}", user.Id, organizationId, service);
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
