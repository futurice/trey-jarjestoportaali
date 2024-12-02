using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Trey.Api.Models;

namespace Trey.Api.Repositories;

public class FormsRepository
{
  private readonly Container _formsCollection;

  public FormsRepository(CosmosClient client, IConfiguration configuration)
  {
    var database = client.GetDatabase(configuration["AZURE_COSMOS_DATABASE_NAME"]);
    _formsCollection = database.GetContainer("Forms");
  }

  public async Task<IEnumerable<Form>> GetFormsAsync(int? skip, int? batchSize)
  {
    return await ToListAsync(
        _formsCollection.GetItemLinqQueryable<Form>(),
        skip,
        batchSize);
  }

  public async Task<Form?> GetFormAsync(string formId)
  {
    var response = await _formsCollection.ReadItemAsync<Form>(formId, new PartitionKey(formId));
    return response?.Resource;
  }

  public async Task DeleteFormAsync(string formId)
  {
    await _formsCollection.DeleteItemAsync<Form>(formId, new PartitionKey(formId));
  }

  public async Task<Form> AddFormAsync(Form form)
  {
    var createdForm = await _formsCollection.CreateItemAsync(form, new PartitionKey(form.Id));
    return createdForm.Resource;
  }

  public async Task<Form> UpdateForm(Form form)
  {
    var item = await _formsCollection.ReplaceItemAsync(form, form.Id, new PartitionKey(form.Id));
    return item.Resource;
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