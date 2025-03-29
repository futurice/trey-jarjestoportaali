namespace Trey.Api.Models;

public enum SurveyLanguage 
{
    En,
    Fi
}
public class Survey
{
    public Guid? Id { get; set; }
    // <lang, name>
    public Dictionary<SurveyLanguage, string> Name { get; set; } = new ();
    public string? SurveyJson { get; set; }
}

public class SurveyAnswer
{
    public Guid? Id { get; set; }
    public Guid SurveyId { get; set; }
    public string? OrganizationId { get; set; }
    public string? AnswerJson { get; set; }
}