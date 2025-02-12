using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using Trey.Api.Models;

namespace Trey.Api.Services;

internal sealed class FileService(BlobContainerClient containerClient, BlobServiceClient serviceClient, ILogger<FileService> logger)
{
    internal static DefaultAzureCredential DefaultCredential { get; } = new();

    public async Task<FileResponse> UploadFilesAsync(IFormFileCollection files,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogDebug("Uploading files to {container}.", containerClient.Uri);

            List<string> uploadedFiles = [];
            foreach (var file in files)
            {
                var fileName = file.FileName;

                await using var stream = file.OpenReadStream();

                var blobClient = containerClient.GetBlobClient(fileName);
                if (await blobClient.ExistsAsync(cancellationToken)) continue;

                await using var fileStream = file.OpenReadStream();
                await blobClient.UploadAsync(fileStream, new BlobHttpHeaders
                {
                    ContentType = "text/plain"
                }, cancellationToken: cancellationToken);
                uploadedFiles.Add(fileName);
            }

            return uploadedFiles.Count is 0
                ? FileResponse.FromError("No files uploaded.")
                : new FileResponse([.. uploadedFiles]);
        }
        catch (Exception ex)
        {
            return FileResponse.FromError(ex.ToString());
        }
    }

    public Task<BlobFile[]> FindFilesAsync(CancellationToken cancellationToken)
    {
        try
        {
            logger.LogDebug("Listing files from {container}.", containerClient.Uri);
            var blobs = containerClient.GetBlobsAsync(cancellationToken: cancellationToken)
                .ToBlockingEnumerable();
            var blobItems = blobs.Select(blob => BlobFile.FromBlobItem(blob) with
            {
                CreatedOn = blob.Properties.CreatedOn,
                LastModified = blob.Properties.LastModified,
                Uri = CreateSasUri(blob.Name).Result.ToString()
            }).ToArray();
            return Task.FromResult(blobItems.ToArray());
        }
        catch (Exception ex)
        {
            return Task.FromException<BlobFile[]>(ex);
        }
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