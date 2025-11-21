using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Trey.Api.Models;

public enum TreyRole
{
    None, // User has not registered yet
    PendingApproval, // User has registered but is pending approval
    Organization,
    TreyBoard,
    Admin,
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
    public required Guid Id { get; set; }
    public string? Username { get; set; }
    public string? OrganizationId { get; set; }
    public TreyRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

[Table("profiles")]
public class TreyUserDbObject : BaseModel
{
    [PrimaryKey("id")]
    public string Id { get; set; }
    [Column("username")]
    public string? Username { get; set; }
    [Column("organization_id")]
    public string? OrganizationId { get; set; }
    [Column("trey_role")]
    public TreyRole Role { get; set; }
    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }
}
