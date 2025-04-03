import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { Box, CircularProgress, Container } from "@mui/material"
import { useStytch } from "@stytch/react"
import "survey-core/i18n/finnish"
import "survey-core/survey-core.css"
import { Model, Survey } from "survey-react-ui"
import { useAuth } from "../../hooks/useAuth"
import { useSurveyService } from "../../hooks/useSurveyService"
import { useGetSurveyById } from "../../hooks/useSurveys"
import surveyTheme from "./SurveyTheme"

export const SurveyPage = () => {
  const { surveyId } = useParams()
  const { user } = useAuth()
  const { session } = useStytch()
  const { i18n } = useTranslation()

  const sessionJwt = useMemo(() => session?.getTokens()?.session_jwt, [session])

  const surveyService = useSurveyService(user?.role, sessionJwt)
  if (!surveyId) {
    throw new Error("Survey ID is required")
  }
  const { survey, loading } = useGetSurveyById(surveyService, surveyId)

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    )
  }

  const surveyJson = new Model(survey?.surveyJson)
  surveyJson.locale = i18n.language ?? "en"
  surveyJson.applyTheme(surveyTheme)

  return (
    <Box sx={{ width: "100vw", overflow: "hidden" }}>
      <Survey model={surveyJson} />
    </Box>
  )
}
