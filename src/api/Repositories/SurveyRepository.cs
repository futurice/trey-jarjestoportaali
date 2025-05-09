using Microsoft.Azure.Cosmos;
using Trey.Api.Models;

namespace Trey.Api.Repositories;

public class SurveyRepository
{
    private readonly Container _surveyCollection;
    private readonly Container _surveyResponseCollection;

    public SurveyRepository(CosmosClient client, IConfiguration configuration)
    {
        var database = client.GetDatabase(configuration["AZURE_COSMOS_DATABASE_NAME"]);
        _surveyCollection = database.GetContainer("Survey");
        _surveyResponseCollection = database.GetContainer("SurveyResponse");
    }

    public async Task<IEnumerable<Survey>> GetAllSurveysAsync()
    {
        var surveys = new List<Survey>();
        var iterator = _surveyCollection.GetItemQueryIterator<Survey>();
        while (iterator.HasMoreResults)
        {
            var response = await iterator.ReadNextAsync();
            surveys.AddRange(response);
        }

        return surveys;
    }

    public async Task<IEnumerable<SurveyAnswer>> GetAllSurveysForOrgAsync(string organizationId)
    {
        var surveys = new List<SurveyAnswer>();
        // Query only surveys for the organization
        var iterator = _surveyResponseCollection.GetItemQueryIterator<SurveyAnswer>(
            new QueryDefinition("SELECT * FROM c WHERE c.organizationId = @organizationId")
                .WithParameter("@organizationId", organizationId));
        while (iterator.HasMoreResults)
        {
            var response = await iterator.ReadNextAsync();
            surveys.AddRange(response);
        }

        return surveys;
    }

    public async Task<Survey?> GetSurveyByIdAsync(Guid id)
    {
        var response = await _surveyCollection.ReadItemAsync<Survey>(id.ToString(), new PartitionKey(id.ToString()));
        return response.Resource;
    }

    public async Task CreateSurveyAsync(Survey survey)
    {
        survey.Id = Guid.NewGuid();
        await _surveyCollection.CreateItemAsync(survey);
    }

    public async Task<bool> UpdateSurveyAsync(Survey survey)
    {
        var response = await _surveyCollection.UpsertItemAsync(survey);
        return response.StatusCode == System.Net.HttpStatusCode.OK;
    }

    public async Task<bool> DeleteSurveyAsync(Guid id)
    {
        var response = await _surveyCollection.DeleteItemAsync<Survey>(id.ToString(), new PartitionKey(id.ToString()));
        return response.StatusCode == System.Net.HttpStatusCode.NoContent;
    }

    public async Task CreateSurveyAnswerAsync(SurveyAnswer answer)
    {
        answer.Id = Guid.NewGuid();
        await _surveyResponseCollection.CreateItemAsync(answer);
    }

    public async Task<SurveyAnswer> UpdateSurveyAnswerAsync(SurveyAnswer answer)
    {
        return await _surveyResponseCollection.UpsertItemAsync(answer);
    }

    public async Task<IEnumerable<SurveyAnswer>> GetSurveyAnswersAsync(Guid surveyId)
    {
        var answers = new List<SurveyAnswer>();
        var iterator =
            _surveyResponseCollection.GetItemQueryIterator<SurveyAnswer>(
                new QueryDefinition("SELECT * FROM c WHERE c.surveyId = @surveyId")
                    .WithParameter("@surveyId", surveyId.ToString()));
        while (iterator.HasMoreResults)
        {
            var response = await iterator.ReadNextAsync();
            answers.AddRange(response);
        }

        return answers;
    }
}