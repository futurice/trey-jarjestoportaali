using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using Microsoft.AspNetCore.Mvc;
using Trey.Api.Models;
using Trey.Api.Repositories;

namespace Trey.Api.Services;

internal sealed class FileService(BlobContainerClient containerClient, BlobServiceClient serviceClient, ILogger<FileService> logger, OrganizationsRepository organizationsRepository)
{
    internal static DefaultAzureCredential DefaultCredential { get; } = new();

    public async Task<List<BlobFile>> UploadFilesAsync(IFormFileCollection files,
        TreyUser user,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogDebug("Uploading files to {container}.", containerClient.Uri);

            List<BlobFile> uploadedFiles = [];
            foreach (var file in files)
            {
                var folderName = user?.OrganizationId?.ToString() ?? "unknown";
                var fileName = string.IsNullOrWhiteSpace(file.FileName)
                    ? Guid.NewGuid().ToString("N")
                    : file.FileName;


                var blobClient = containerClient.GetBlobClient($"{folderName}/{fileName}");
                if (await blobClient.ExistsAsync(cancellationToken))
                {
                    var fileNameParts = fileName.Split('.');
                    blobClient = containerClient.GetBlobClient($"{folderName}/{fileNameParts[0]}-{Guid.NewGuid():N}.{fileNameParts[^1]}");
                }

                await using var fileStream = file.OpenReadStream();
                await blobClient.UploadAsync(fileStream, new BlobHttpHeaders
                {
                    ContentType = file.ContentType ?? "application/octet-stream"
                }, cancellationToken: cancellationToken);
                await blobClient.SetMetadataAsync(new Dictionary<string, string>
                {
                    { "uploadedOn", DateTime.UtcNow.ToString("o") },
                    { "organizationId", user?.OrganizationId?.ToString() ?? "unknown" },
                    { "uploadedBy", user?.Id.ToString() ?? "anonymous" },
                    { "originalFileName", file.FileName }
                }, cancellationToken: cancellationToken);
                var blobProperties = await blobClient.GetPropertiesAsync(cancellationToken: cancellationToken);
                uploadedFiles.Add(new BlobFile(
                    Id: blobClient.Name,
                    FileName: fileName,
                    Uri: blobClient.Uri.ToString(),
                    ContentType: blobProperties.Value.ContentType,
                    CreatedDate: blobProperties.Value.CreatedOn.UtcDateTime,
                    UpdatedDate: blobProperties.Value.LastModified.UtcDateTime,
                    UploadedBy: blobProperties.Value.Metadata.TryGetValue("uploadedBy", out var uploadedBy)
                        ? uploadedBy
                        : null,
                    OrganizationId: blobProperties.Value.Metadata.TryGetValue("organizationId", out var orgIdString)
                                    && Guid.TryParse(orgIdString, out var orgId)
                        ? orgId
                        : null,
                    OriginalFileName: blobProperties.Value.Metadata.TryGetValue("originalFileName", out var originalFileName)
                        ? originalFileName
                        : null
                ));
            }

            return uploadedFiles.Count is 0
                ? []
                : uploadedFiles;
        }
        catch (Exception ex)
        {
            return await Task.FromException<List<BlobFile>>(ex);
        }
    }

    public async Task<List<BlobFile>> FindFilesAsync(CancellationToken cancellationToken)
    {
        try
        {
            logger.LogDebug("Listing files from {container}.", containerClient.Uri);
            var results = new List<BlobFile>();
            await foreach (var blob in containerClient.GetBlobsAsync(
                   traits: BlobTraits.Metadata,
                   cancellationToken: cancellationToken))
            {
                var sasUri = await CreateSasUri(blob.Name);
                results.Add(BlobFile.FromBlobItem(blob) with
                {
                    Uri = sasUri.ToString()
                });
            }
            return results;
        }
        catch (Exception ex)
        {
            return await Task.FromException<List<BlobFile>>(ex);
        }
    }

    public async Task<List<BlobFile>> GetFilesByOrganizationAsync(IAuthService auth, Guid organizationId, CancellationToken cancellationToken)
    {
        try
        {
            var results = new List<BlobFile>();

            // Ensure metadata is included
            await foreach (var blob in containerClient.GetBlobsAsync(
                            traits: BlobTraits.Metadata,
                            cancellationToken: cancellationToken))
            {
                if (blob.Metadata.TryGetValue("organizationId", out var orgIdString)
                    && Guid.TryParse(orgIdString, out var orgId)
                    && orgId == organizationId)
                {
                    var sasUri = await CreateSasUri(blob.Name);
                    results.Add(BlobFile.FromBlobItem(blob) with
                    {
                        Uri = sasUri.ToString(),
                        UploadedByUsername = blob.Metadata.TryGetValue("uploadedBy", out var uploadedByUserString)
                            ? (await auth.FindUserById(uploadedByUserString))?.Username
                            : null,
                        OrganizationName = await organizationsRepository.GetOrganizationAsync(organizationId.ToString()) is Organization org
                            ? org.Name
                            : null
                    });
                }
            }

            return results;
        }
        catch (Exception ex)
        {
            return await Task.FromException<List<BlobFile>>(ex);
        }
    }

    public async Task<BlobFile> GetFileByNameAsync(string id, IAuthService auth, CancellationToken cancellationToken)
    {
        try
        {
            var blobClient = containerClient.GetBlobClient(id);
            if (!await blobClient.ExistsAsync(cancellationToken))
            {
                throw new FileNotFoundException($"File '{id}' not found in container '{containerClient.Name}'.");
            }
            var blobProperties = await blobClient.GetPropertiesAsync(cancellationToken: cancellationToken);

            var blobFile = new BlobFile(
                    Id: id,
                    FileName: blobClient.Name,
                    Uri: blobClient.Uri.ToString(),
                    ContentType: blobProperties.Value.ContentType,
                    CreatedDate: blobProperties.Value.CreatedOn.UtcDateTime,
                    UpdatedDate: blobProperties.Value.LastModified.UtcDateTime,
                    UploadedBy: blobProperties.Value.Metadata.TryGetValue("uploadedBy", out var uploadedBy)
                        ? uploadedBy
                        : null,
                    OrganizationId: blobProperties.Value.Metadata.TryGetValue("organizationId", out var orgIdString)
                                    && Guid.TryParse(orgIdString, out var orgId)
                        ? orgId
                        : null,
                    OriginalFileName: blobProperties.Value.Metadata.TryGetValue("originalFileName", out var originalFileName)
                        ? originalFileName
                        : null,
                    UploadedByUsername: blobProperties.Value.Metadata.TryGetValue("uploadedBy", out var uploadedByUserString)
                            ? (await auth.FindUserById(uploadedByUserString))?.Username
                            : null,
                    OrganizationName: blobProperties.Value.Metadata.TryGetValue("organizationId", out var organizationIdString)
                        && Guid.TryParse(organizationIdString, out var organizationId)
                            ? (await organizationsRepository.GetOrganizationAsync(organizationId.ToString()))?.Name
                            : null
            );

            return blobFile;
        }
        catch (Exception ex)
        {
            return await Task.FromException<BlobFile>(ex);
        }
    }

    public async Task<BlobDownloadResult> GetFileContentByNameAsync(string blobPath, CancellationToken cancellationToken)
    {
        var blobClient = containerClient.GetBlobClient(blobPath);
        if (!await blobClient.ExistsAsync(cancellationToken))
        {
            throw new FileNotFoundException($"File '{blobPath}' not found in container '{containerClient.Name}'.");
        }

        var download = await blobClient.DownloadContentAsync(cancellationToken);
        return download.Value;
    }

    public async Task<bool> DeleteFileByIdAsync(string fileId, CancellationToken cancellationToken)
    {
        var blobClient = containerClient.GetBlobClient(fileId);
        var response = await blobClient.DeleteIfExistsAsync(cancellationToken: cancellationToken);
        return response.Value;
    }

    private async Task<Uri> CreateSasUri(string filename)
    {
        var userDelegationKey =
            await serviceClient.GetUserDelegationKeyAsync(
                DateTimeOffset.UtcNow,
                DateTimeOffset.UtcNow.AddDays(1));

        var blobClient = serviceClient
            .GetBlobContainerClient(containerClient.Name)
            .GetBlobClient(filename);

        var sasBuilder = new BlobSasBuilder()
        {
            BlobContainerName = blobClient.BlobContainerName,
            BlobName = blobClient.Name,
            Resource = "b", // "blob"
            StartsOn = DateTimeOffset.UtcNow,
            ExpiresOn = DateTimeOffset.UtcNow.AddDays(1)
        };

        sasBuilder.SetPermissions(BlobSasPermissions.Read);

        var uriBuilder = new BlobUriBuilder(blobClient.Uri)
        {
            Sas = sasBuilder.ToSasQueryParameters(
                userDelegationKey,
                blobClient
                    .GetParentBlobContainerClient()
                    .GetParentBlobServiceClient().AccountName)
        };

        return uriBuilder.ToUri();
    }
}
