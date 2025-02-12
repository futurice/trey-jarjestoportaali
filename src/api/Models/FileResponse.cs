using Azure.Storage.Blobs.Models;

namespace Trey.Api.Models;

public record FileResponse(
    string[] File,
    string? Error = null)
{
    public static FileResponse FromError(string error)
    {
        return new FileResponse([], error);
    }
}

public record BlobFile(
    string Id,
    string? Uri = null)
{
    public static BlobFile FromBlobItem(BlobItem blob)
    {
        return new BlobFile(blob.Name);
    }
}