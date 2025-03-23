
using Trey.Api.Models;
using Trey.Api.Repositories;

namespace Trey.Api.Extensions;
public static class SurveyEndpointExtensions
{
    public static RouteGroupBuilder MapSurveyEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/", GetAllSurveys);
        group.MapGet("/{id:guid}", GetSurveyById);
        group.MapPost("/", CreateSurvey);
        group.MapPut("/{id:guid}", UpdateSurvey);
        group.MapDelete("/{id:guid}", DeleteSurvey);
        group.MapPost("/{surveyId:guid}/answers", CreateSurveyAnswer);
        group.MapGet("/{surveyId:guid}/answers", GetSurveyAnswers);

        return group;
    }

    private static async Task<IResult> GetAllSurveys(SurveyRepository repo)
    {
        var surveys = await repo.GetAllSurveysAsync();
        return Results.Ok(surveys);
    }

    private static async Task<IResult> GetSurveyById(Guid id, SurveyRepository repo)
    {
        var survey = await repo.GetSurveyByIdAsync(id);
        return survey is null ? Results.NotFound() : Results.Ok(survey);
    }

    private static async Task<IResult> CreateSurvey(Survey survey, SurveyRepository repo)
    {
        await repo.CreateSurveyAsync(survey);
        return Results.Created($"/surveys/{survey.Id}", survey);
    }

    private static async Task<IResult> UpdateSurvey(Guid id, Survey survey, SurveyRepository repo)
    {
        if (id != survey.Id) return Results.BadRequest();
        var updated = await repo.UpdateSurveyAsync(survey);
        return updated ? Results.Ok(survey) : Results.NotFound();
    }

    private static async Task<IResult> DeleteSurvey(Guid id, SurveyRepository repo)
    {
        var deleted = await repo.DeleteSurveyAsync(id);
        return deleted ? Results.Ok() : Results.NotFound();
    }

    private static async Task<IResult> CreateSurveyAnswer(Guid surveyId, SurveyAnswer answer, SurveyRepository repo)
    {
        answer.SurveyId = surveyId;
        await repo.CreateSurveyAnswerAsync(answer);
        return Results.Created($"/surveys/{surveyId}/answers/{answer.Id}", answer);
    }

    private static async Task<IResult> GetSurveyAnswers(Guid surveyId, SurveyRepository repo)
    {
        var answers = await repo.GetSurveyAnswersAsync(surveyId);
        return Results.Ok(answers);
    }
}
