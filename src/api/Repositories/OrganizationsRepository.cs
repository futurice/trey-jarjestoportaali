using System.Net;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Trey.Api.Models;

namespace Trey.Api.Repositories;

public class OrganizationsRepository
{
  private readonly Container _organizationsCollection;

  public OrganizationsRepository(CosmosClient client, IConfiguration configuration)
  {
    var database = client.GetDatabase(configuration["AZURE_COSMOS_DATABASE_NAME"]);
    _organizationsCollection = database.GetContainer("Organization");
  }

  public async Task<IEnumerable<Organization>> GetOrganizationsAsync(int skip = 0, int batchSize = 1000)
  {
    return await ToListAsync(
        _organizationsCollection.GetItemLinqQueryable<Organization>(),
        skip,
        batchSize);
  }

  public async Task<Organization?> GetOrganizationAsync(string organizationId)
  {
    try
    {
      var response = await _organizationsCollection.ReadItemAsync<Organization>(organizationId, new PartitionKey(organizationId));
      return response?.Resource;
    }
    catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
    {
      return null;
    }
  }

  public async Task<ItemResponse<Organization>> AddOrganizationAsync(Organization organization)
  {
    organization.Id = Guid.NewGuid();
    return await _organizationsCollection.UpsertItemAsync(organization, new PartitionKey(organization.Id.ToString()));
  }

  public async Task<ItemResponse<Organization>> UpdateOrganization(string organizationId, Organization organization)
  {
    return await _organizationsCollection.ReplaceItemAsync(organization, organizationId, new PartitionKey(organizationId));
  }

  public async Task<ItemResponse<Organization>> DeleteOrganization(string organizationId)
  {
    return await _organizationsCollection.DeleteItemAsync<Organization>(organizationId, new PartitionKey(organizationId));
  }

  private static async Task<List<T>> ToListAsync<T>(IQueryable<T> queryable, int? skip, int? batchSize)
  {
    if (skip != null)
    {
      queryable = queryable.Skip(skip.Value);
    }

    if (batchSize != null)
    {
      queryable = queryable.Take(batchSize.Value);
    }

    using FeedIterator<T> iterator = queryable.ToFeedIterator();
    var items = new List<T>();

    while (iterator.HasMoreResults)
    {
      foreach (var item in await iterator.ReadNextAsync())
      {
        items.Add(item);
      }
    }

    return items;
  }
}