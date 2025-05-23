using System.Net;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Trey.Api.Models;

namespace Trey.Api.Repositories;

public class UsersRepository
{
    private readonly Container _usersContainer;
    
    public UsersRepository(CosmosClient client, IConfiguration configuration)
    {
        var database = client.GetDatabase(configuration["AZURE_COSMOS_DATABASE_NAME"]);
        _usersContainer = database.GetContainer("Users");
    }

    public async Task<Trey.Api.Models.User?> GetUserByUsernameAsync(string username)
    {
        try
        {
            var query = _usersContainer.GetItemLinqQueryable<Trey.Api.Models.User>()
                .Where(u => u.Username == username)
                .Take(1);

            var iterator = query.ToFeedIterator();
            var results = await iterator.ReadNextAsync();
            return results.FirstOrDefault();
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    public async Task<Trey.Api.Models.User?> GetUserByEmailAsync(string email)
    {
        try
        {
            var query = _usersContainer.GetItemLinqQueryable<Trey.Api.Models.User>()
                .Where(u => u.Email == email)
                .Take(1);

            var iterator = query.ToFeedIterator();
            var results = await iterator.ReadNextAsync();
            return results.FirstOrDefault();
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    public async Task<Trey.Api.Models.User?> GetUserByResetTokenAsync(string resetToken)
    {
        try
        {
            var query = _usersContainer.GetItemLinqQueryable<Trey.Api.Models.User>()
                .Where(u => u.ResetToken == resetToken && u.ResetTokenExpiry > DateTime.UtcNow)
                .Take(1);

            var iterator = query.ToFeedIterator();
            var results = await iterator.ReadNextAsync();
            return results.FirstOrDefault();
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    public async Task<Trey.Api.Models.User?> GetUserByVerificationTokenAsync(string token)
    {
        try
        {
            var query = _usersContainer.GetItemLinqQueryable<Trey.Api.Models.User>()
                .Where(u => u.VerificationToken == token)
                .Take(1);

            var iterator = query.ToFeedIterator();
            var results = await iterator.ReadNextAsync();
            return results.FirstOrDefault();
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    public async Task<ItemResponse<Trey.Api.Models.User>> CreateUserAsync(Trey.Api.Models.User user)
    {
        return await _usersContainer.CreateItemAsync(user, new PartitionKey(user.Id));
    }

    public async Task<ItemResponse<Trey.Api.Models.User>> UpdateUserAsync(Trey.Api.Models.User user)
    {
        user.UpdatedAt = DateTime.UtcNow;
        return await _usersContainer.UpsertItemAsync(user, new PartitionKey(user.Id));
    }

    public async Task<ItemResponse<Trey.Api.Models.User>> DeleteUserAsync(string userId)
    {
        return await _usersContainer.DeleteItemAsync<Trey.Api.Models.User>(userId, new PartitionKey(userId));
    }

    public async Task<IEnumerable<Trey.Api.Models.User>> GetAllUsersAsync(int skip = 0, int batchSize = 1000)
    {
        var query = _usersContainer.GetItemLinqQueryable<Trey.Api.Models.User>()
            .Skip(skip)
            .Take(batchSize);

        var iterator = query.ToFeedIterator();
        var results = await iterator.ReadNextAsync();
        return results;
    }
} 