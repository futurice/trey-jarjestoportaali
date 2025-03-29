namespace Trey.Api.Models;

public enum TreyRole
{
    PendingApproval, // User has registered but is pending approval
    Organization,
    TreyBoard,
    Admin,
    None, // User has not registered yet
}

public static class TreyRoleExtensions
{
    public static TreyRole ToTreyRole(this string roleString)
    {
        if (string.IsNullOrEmpty(roleString))
            return TreyRole.None;

        var normalizedString = roleString.Replace("_", "")
            .Replace(" ", "")
            .ToLowerInvariant();

        return normalizedString switch
        {
            "pending_approval" => TreyRole.PendingApproval,
            "organization" => TreyRole.Organization,
            "trey_board" => TreyRole.TreyBoard,
            "admin" => TreyRole.Admin,
            "none" => TreyRole.None,
            _ => TreyRole.None
        };
    }
}

public class TreyUser
{
    public required string Name { get; set; }
    public required string OrganizationId { get; set; }
    public TreyRole Role { get; set; }
}