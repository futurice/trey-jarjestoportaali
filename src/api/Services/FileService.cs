using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Trey.Api.Models;

namespace Trey.Api.Services;

internal sealed class FileService(BlobContainerClient container, ILogger<FileService> logger)
{
    internal static DefaultAzureCredential DefaultCredential { get; } = new();

    public async Task<FileResponse> UploadFilesAsync(IFormFileCollection files,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogDebug("Uploading files to {container}.", container.Uri);

            List<string> uploadedFiles = [];
            foreach (var file in files)
            {
                var fileName = file.FileName;

                await using var stream = file.OpenReadStream();

                var blobClient = container.GetBlobClient(fileName);
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
            logger.LogDebug("Listing files from {container}.", container.Uri);
            // TODO: change to async
            var blobs = container.GetBlobsAsync(cancellationToken: cancellationToken)
                .ToBlockingEnumerable();
            var blobItems = blobs.Select(blob => BlobFile.FromBlobItem(blob)).ToArray();
            return Task.FromResult(blobItems.ToArray());
        }
        catch (Exception ex)
        {
            return Task.FromException<BlobFile[]>(ex);
        }
    }
}