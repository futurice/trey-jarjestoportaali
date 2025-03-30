namespace Trey.Api.Models;

[AttributeUsage(AttributeTargets.Method)]
public class RequiredRoleAttribute(params TreyRole[] roles) : Attribute
{
    public TreyRole[] Roles { get; } = roles;
} 