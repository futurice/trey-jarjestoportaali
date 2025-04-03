import { useMemo } from "react"
import { Roles } from "../authentication"
import config from "../config"
import { SurveyAnswerService } from "../services/surveyAnswerService"

export const useSurveyAnswerService = (
  role: Roles | undefined,
  authToken: string | undefined,
  surveyId: string,
) => {
  return useMemo(() => {
    if (!role || !authToken) {
      return null
    }
    return new SurveyAnswerService(config.api.baseUrl, role, authToken, surveyId)
  }, [role, authToken, surveyId])
}
