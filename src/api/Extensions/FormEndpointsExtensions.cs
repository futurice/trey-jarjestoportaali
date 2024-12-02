
using Trey.Api.Models;
using Trey.Api.Repositories;

namespace Trey.Api.Extensions
{
  public static class FormEndpointsExtensions
  {
    public static RouteGroupBuilder MapFormsApi(this RouteGroupBuilder group)
    {
      group.MapGet("/", GetForms);
      group.MapPost("/", CreateForm);
      group.MapGet("/{formId}", GetForm);
      group.MapPut("/{formId}", UpdateForm);
      return group;
    }

    private static async Task<IResult> GetForms(FormsRepository repository, int? skip = null, int? batchSize = null)
    {
      var results = await repository.GetFormsAsync(skip, batchSize);
      if (results == null)
      {
        return TypedResults.NotFound();
      }
      return TypedResults.Ok(results);
    }
    private static async Task<IResult> GetForm(FormsRepository repository, string formId)
    {
      var result = await repository.GetFormAsync(formId);
      if (result == null)
      {
        return TypedResults.NotFound();
      }
      return TypedResults.Ok(result);
    }
    private static async Task<IResult> CreateForm(FormsRepository repository, Form form)
    {
      try
      {
        var createdForm = await repository.AddFormAsync(form);
        return TypedResults.Created($"/lists/{createdForm.Id}", createdForm);
      }
      catch (Exception e)
      {
        return TypedResults.BadRequest(e.Message);
      }
    }
    private static async Task<IResult> UpdateForm(FormsRepository repository, string formId, Form form)
    {
      var existingForm = await repository.GetFormAsync(formId);
      if (existingForm == null)
      {
        return TypedResults.NotFound();
      }
      existingForm.Name = form.Name;
      existingForm.Description = form.Description;
      existingForm.State = form.State;
      existingForm.Questions = form.Questions;
      existingForm.UpdatedDate = DateTimeOffset.UtcNow;

      var updatedForm = await repository.UpdateForm(existingForm);
      return TypedResults.Ok(updatedForm);
    }
  }
}


