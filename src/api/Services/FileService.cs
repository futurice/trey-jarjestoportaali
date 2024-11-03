using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Todo.Api.Models;

namespace Todo.Api.Services;

internal sealed class FileService(BlobContainerClient container, ILogger<FileService> logger)
{
    internal static DefaultAzureCredential DefaultCredential { get; } = new();

    public async Task<FilesResponse> UploadFilesAsync(IFormFileCollection files,
        CancellationToken cancellationToken)
    {
        try {
            logger.LogDebug("Uploading files to {container}.", container.Uri);
            
            List<string> uploadedFiles = [];
            foreach (var file in files)
            {
                var fileName = file.FileName;

                await using var stream = file.OpenReadStream();
                
                var blobClient = container.GetBlobClient(fileName);
                if (await blobClient.ExistsAsync(cancellationToken))
                {
                    continue;
                }

                await using var fileStream = file.OpenReadStream();
                await blobClient.UploadAsync(fileStream, new BlobHttpHeaders
                {
                    ContentType = "text/plain"
                }, cancellationToken: cancellationToken);
                uploadedFiles.Add(fileName);
            }

            return uploadedFiles.Count is 0
                ? FilesResponse.FromError("No files uploaded.")
                : new FilesResponse([.. uploadedFiles]);
        }
        catch (Exception ex)
        {
            return FilesResponse.FromError(ex.ToString());
        }
    }
    
    public Task<FilesResponse> FindFilesAsync(CancellationToken cancellationToken)
    {
        try
        {
            logger.LogDebug("Listing files from {container}.", container.Uri);
            // TODO: change to async
            var blobs = container.GetBlobsAsync(cancellationToken: cancellationToken)
                .ToBlockingEnumerable();
            var blobItems = blobs.ToList();
            return Task.FromResult(blobItems.Count != 0
                ? new FilesResponse([.. blobItems.Select(blob => blob.Name)])
                : FilesResponse.FromError("No files found."));
        }
        catch (Exception ex)
        {
            return Task.FromResult(FilesResponse.FromError(ex.ToString()));
        }
    }
}