namespace Trey.Api.Models;

public record FilesResponse(
    string[] Files,
    string? Error = null)
{
    public static FilesResponse FromError(string error)
    {
        return new FilesResponse([], error);
    }
}