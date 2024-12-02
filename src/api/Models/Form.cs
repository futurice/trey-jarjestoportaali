namespace Trey.Api.Models;

public enum FormState
{
  Draft = 0,
  Published = 1,
  Archived = 2
}

public class Form
{
  public string Id { get; } = Guid.NewGuid().ToString();
  public string Name { get; set; } = default!;
  public string? Description { get; set; }
  public FormState State { get; set; } = FormState.Draft;
  public List<FormQuestion> Questions { get; set; } = [];
  public DateTimeOffset CreatedDate { get; } = DateTimeOffset.UtcNow;
  public DateTimeOffset UpdatedDate { get; set; } = DateTimeOffset.UtcNow;
}