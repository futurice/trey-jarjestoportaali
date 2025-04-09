using Trey.Api.Models;
using Trey.Api.Repositories;
using Trey.Api.Services;

namespace Trey.Api.Extensions;
public static class SurveyEndpointExtensions
{
    public static RouteGroupBuilder MapSurveyEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/", GetAllSurveys); // Requires TREY admin role
        group.MapGet("/organization", GetAllSurveysForOrg);
        group.MapGet("/{id:guid}", GetSurveyById);
        group.MapPost("/", CreateSurvey);
        group.MapPut("/{id:guid}", UpdateSurvey);
        group.MapDelete("/{id:guid}", DeleteSurvey);
        group.MapPost("/{surveyId:guid}/answers", CreateSurveyAnswer);
        group.MapGet("/{surveyId:guid}/answers", GetSurveyAnswers);
        group.MapPut("/{surveyId:guid}/answers/{responseId:guid}", UpdateSurveyAnswer);

        return group;
    }

    [RequiredRole(TreyRole.Admin, TreyRole.TreyBoard, TreyRole.Organization)]
    private static async Task<IResult> GetAllSurveys(SurveyRepository repo, IAuthService auth, HttpContext context)
    {
        var user = await auth.GetUserFromContext(context);
        var surveys = await repo.GetAllSurveysAsync();
        if (user.Role == TreyRole.Organization)
        {
            surveys = surveys.Where(s => s.ResponsePeriod == null || (s.ResponsePeriod.Start >= DateTime.UtcNow && s.ResponsePeriod.End <= DateTime.UtcNow));
        }
        return Results.Ok(surveys);
    }

    [RequiredRole(TreyRole.Organization)]
    private static async Task<IResult> GetAllSurveysForOrg(SurveyRepository repo, IAuthService auth, HttpContext context)
    {
        var user = await auth.GetUserFromContext(context);
        var surveys = await repo.GetAllSurveysForOrgAsync(user.OrganizationId);
        return Results.Ok(surveys);
    }

    [RequiredRole(TreyRole.Admin, TreyRole.TreyBoard, TreyRole.Organization)]
    private static async Task<IResult> GetSurveyById(Guid id, SurveyRepository repo, IAuthService auth, HttpContext context)
    {
        var user = await auth.GetUserFromContext(context);
        var survey = await repo.GetSurveyByIdAsync(id);
        return survey is null ? Results.NotFound() : Results.Ok(survey);
    }

    [RequiredRole(TreyRole.Admin)]
    private static async Task<IResult> CreateSurvey(Survey survey, SurveyRepository repo)
    {
        await repo.CreateSurveyAsync(survey);
        return Results.Created($"/surveys/{survey.Id}", survey);
    }

    [RequiredRole(TreyRole.Admin)]
    private static async Task<IResult> UpdateSurvey(Guid id, Survey survey, SurveyRepository repo)
    {
        if (id != survey.Id) return Results.BadRequest();
        var updated = await repo.UpdateSurveyAsync(survey);
        return updated ? Results.Ok(survey) : Results.NotFound();
    }

    [RequiredRole(TreyRole.Admin)]
    private static async Task<IResult> DeleteSurvey(Guid id, SurveyRepository repo)
    {
        var deleted = await repo.DeleteSurveyAsync(id);
        return deleted ? Results.Ok() : Results.NotFound();
    }

    [RequiredRole(TreyRole.Organization, TreyRole.Admin, TreyRole.TreyBoard)]
    private static async Task<IResult> CreateSurveyAnswer(Guid surveyId, SurveyAnswer answer, SurveyRepository repo)
    {
        answer.SurveyId = surveyId;
        await repo.CreateSurveyAnswerAsync(answer);
        return Results.Created($"/surveys/{surveyId}/answers/{answer.Id}", answer);
    }

    [RequiredRole(TreyRole.Organization, TreyRole.Admin, TreyRole.TreyBoard)]
    private static async Task<IResult> UpdateSurveyAnswer(Guid surveyId, Guid responseId, SurveyAnswer answer, SurveyRepository repo)
    {
        answer.SurveyId = surveyId;
        answer.Id = responseId;
        await repo.UpdateSurveyAnswerAsync(answer);
        return Results.Ok(answer);
    }

    [RequiredRole(TreyRole.Admin)]
    private static async Task<IResult> GetSurveyAnswers(Guid surveyId, SurveyRepository repo)
    {
        var answers = await repo.GetSurveyAnswersAsync(surveyId);
        return Results.Ok(answers);
    }
}
