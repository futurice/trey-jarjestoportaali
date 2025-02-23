using Newtonsoft.Json.Linq;
using Stytch.net.Clients;
using Stytch.net.Models.Consumer;
using Trey.Api.Models;

namespace Trey.Api.Services;

public class UserService(ConsumerClient stytchClient)
{
  private readonly ConsumerClient _stytchClient = stytchClient;

  private Dictionary<string, object> MetadataToDictionary(object metadata)
  {
    if (metadata is JObject metadataObject)
    {
      return metadataObject.ToObject<Dictionary<string, object>>() ?? [];
    }
    else
    {
      return [];
    }
  }

  public async Task<List<User>> GetUsersAsync()
  {
    UsersSearchResponse? users = await _stytchClient.Users.Search(new UsersSearchRequest
    {
      Query = new SearchUsersQuery(),
    });
    users.Results.ForEach(user =>
      user.TrustedMetadata = MetadataToDictionary(user.TrustedMetadata)
    );
    return users.Results;
  }

  public async Task<User> UpdateUser(string userId, UpdateUserDTO userData)
  {
    var response = await _stytchClient.Users.Update(new UsersUpdateRequest(userId)
    {
      TrustedMetadata = userData.Role != null ? JObject.FromObject(new { role = userData.Role }) : null,
    });
    response.User.TrustedMetadata = MetadataToDictionary(response.User.TrustedMetadata);
    return response.User;
  }

  public async Task<UsersGetResponse> GetUserAsync(string UserId)
  {
    var user = await _stytchClient.Users.Get(new UsersGetRequest(UserId));
    user.TrustedMetadata = MetadataToDictionary(user.TrustedMetadata);
    return user;
  }
}