using System.Text.Json.Serialization;
namespace Trey.Api.Models;

public enum ResponseType
{
  TextField = 0,
}

public class FormQuestion
{
  public Guid Id { get; set; } = Guid.NewGuid();
  public string Title { get; set; } = default!;
  public ResponseType ResponseType { get; set; } = ResponseType.TextField;
}