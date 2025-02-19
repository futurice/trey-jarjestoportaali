using System.Net;
using Microsoft.AspNetCore.Mvc;
using Trey.Api.Models;
using Trey.Api.Repositories;

namespace Trey.Api.Extensions;

public static class OrganizationEndpointsExtensions
{
  public static RouteGroupBuilder MapOrganizationApi(this RouteGroupBuilder group)
  {
    group.MapGet("/", GetOrganizations);
    group.MapGet("/{organizationId}", GetOrganizationById);
    group.MapPost("/", CreateOrganization);
    group.MapPut("/{organizationId}", UpdateOrganization);
    group.MapDelete("/{organizationId}", DeleteOrganization);
    return group;
  }

  private static async Task<IResult> GetOrganizations(OrganizationsRepository service)
  {
    var response = await service.GetOrganizationsAsync();
    return TypedResults.Ok(response);
  }

  private static async Task<IResult> GetOrganizationById(OrganizationsRepository service, string organizationId)
  {
    var response = await service.GetOrganizationAsync(organizationId);
    return response != null ? TypedResults.Ok(response) : TypedResults.NotFound();
  }

  private static async Task<IResult> CreateOrganization(OrganizationsRepository service, [FromBody] Organization organization)
  {
    var result = await service.AddOrganizationAsync(organization);
    if (result.StatusCode != HttpStatusCode.Created)
    {
      return TypedResults.BadRequest("Failed to create organization");
    }
    else
    {
      return TypedResults.Created($"/organizations/{result.Resource.Id}", result.Resource);
    }
  }
  private static async Task<IResult> UpdateOrganization(OrganizationsRepository service, [FromBody] Organization organization, string organizationId)
  {
    var existingOrganization = await service.GetOrganizationAsync(organizationId);
    if (existingOrganization == null)
    {
      return TypedResults.NotFound();
    }

    var result = await service.UpdateOrganization(organizationId, organization);
    if (result.StatusCode != HttpStatusCode.OK)
    {
      return TypedResults.BadRequest("Failed to update organization");
    }
    return TypedResults.Ok(result.Resource);
  }
  private static async Task<IResult> DeleteOrganization(OrganizationsRepository service, string organizationId)
  {
    var existingOrganization = await service.GetOrganizationAsync(organizationId);
    if (existingOrganization == null)
    {
      return TypedResults.NotFound();
    }
    var result = await service.DeleteOrganization(organizationId);
    if (result.StatusCode != HttpStatusCode.NoContent)
    {
      return TypedResults.BadRequest("Failed to delete organization");
    }
    return TypedResults.NoContent();
  }
}