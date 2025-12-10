using Azure.Storage.Blobs.Models;

namespace Trey.Api.Models;

public record BlobFile(
    string Id,                    // Blob name, e.g. "orgId/fileName.ext"
    string? Uri = null,           // SAS URL or API URL for download
    string? Content = null,       // Base64 only for single-file responses
    string? FileName = null,      // Display name, e.g. "fileName.ext"
    string? ContentType = null,   // MIME type
    long? Size = null,            // File size in bytes
    DateTime? CreatedDate = null,
    DateTime? UpdatedDate = null,
    string? UploadedBy = null,
    string? UploadedByUsername = null,
    Guid? OrganizationId = null,
    string? OrganizationName = null,
    string? OriginalFileName = null,
    long? FileSize = null,
    string[]? Tags = null)
{
    public static BlobFile FromBlobItem(BlobItem blob)
    {
        return new BlobFile(
            Id: blob.Name,
            FileName: Path.GetFileName(blob.Name),
            ContentType: blob.Properties.ContentType,
            Size: blob.Properties.ContentLength,
            CreatedDate: blob.Properties.CreatedOn?.UtcDateTime,
            UpdatedDate: blob.Properties.LastModified?.UtcDateTime,
            UploadedBy: blob.Metadata.TryGetValue("uploadedBy", out var uploadedBy)
                ? uploadedBy
                : null,
            OrganizationId: blob.Metadata.TryGetValue("organizationId", out var orgIdString)
                             && Guid.TryParse(orgIdString, out var orgId)
                ? orgId
                : null,
            OriginalFileName: blob.Metadata.TryGetValue("originalFileName", out var originalFileName)
                ? originalFileName
                : null,
            FileSize: blob.Properties.ContentLength
        );
    }
}
