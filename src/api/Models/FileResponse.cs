namespace Todo.Api.Models;

public record FilesResponse(
    string[] Files,
    string? Error = null)
{

    public static FilesResponse FromError(string error) =>
        new([], error);
}
