namespace Trey.Api.Models;

[AttributeUsage(AttributeTargets.Method)]
public class RequiredRoleAttribute(TreyRole role) : Attribute
{
    public TreyRole Role { get; } = role;
} 