import { Roles } from "../authentication"
import { SurveyAnswer } from "../models/survey.ts"
import { RestService } from "./restService.ts"

export class SurveyAnswerService extends RestService<SurveyAnswer> {
  public readonly baseUrl: string
  public readonly role: Roles
  public readonly authToken: string
  public readonly surveyId: string

  public constructor(baseUrl: string, role: Roles, authToken: string, surveyId: string) {
    const baseRoute = `/surveys/${surveyId}/answers`
    super(baseUrl, baseRoute, authToken)
    this.baseUrl = baseUrl
    this.role = role
    this.authToken = authToken
    this.surveyId = surveyId
  }

  public async getAnswersByOrg(): Promise<SurveyAnswer[]> {
    const response = await this.client.request<SurveyAnswer[]>({
      method: "GET",
      url: `${this.baseUrl}/surveys/organization`,
    })

    return response.data
  }
}
