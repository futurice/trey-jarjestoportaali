import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { CircularProgress, Container } from "@mui/material"
import { useStytch } from "@stytch/react"
import "survey-core/survey-core.css"
import { Model, Survey } from "survey-react-ui"
import { useAuth } from "../../hooks/useAuth"
import { useSurveyService } from "../../hooks/useSurveyService"
import { useGetSurveyById } from "../../hooks/useSurveys"

export const SurveyPage = () => {
  const { surveyId } = useParams()
  const { user } = useAuth()
  const { session } = useStytch()

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

  return (
    <Container>
      <Survey model={surveyJson} />
    </Container>
  )
}
