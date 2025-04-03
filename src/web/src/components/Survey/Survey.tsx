import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { Box, CircularProgress, Container, Typography } from "@mui/material"
import { useStytch } from "@stytch/react"
import { CompleteEvent } from "survey-core"
import "survey-core/i18n/finnish"
import "survey-core/survey-core.css"
import { Model, Survey, SurveyModel } from "survey-react-ui"
import { useAuth } from "../../hooks/useAuth"
import { useSurveyAnswerService } from "../../hooks/useSurveyAnswerService"
import { useGetSurveyResults } from "../../hooks/useSurveyAnswers"
import { useSurveyService } from "../../hooks/useSurveyService"
import { useGetSurveyById } from "../../hooks/useSurveys"
import { SurveyAnswer } from "../../models/survey"
import surveyTheme from "./SurveyTheme"

export const SurveyPage = () => {
  const { surveyId } = useParams()
  const { user } = useAuth()
  const { session } = useStytch()
  const { i18n } = useTranslation()

  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswer | undefined>(undefined)
  const [responseSaved, setResponseSaved] = useState<Date | undefined>(undefined)
  const sessionJwt = useMemo(() => session?.getTokens()?.session_jwt, [session])

  const surveyService = useSurveyService(user?.role, sessionJwt)
  if (!surveyId) {
    throw new Error("Survey ID is required")
  }
  const { survey, loading } = useGetSurveyById(surveyService, surveyId)

  const surveyAnswerService = useSurveyAnswerService(user?.role, sessionJwt, surveyId)
  const { surveyResults } = useGetSurveyResults(surveyAnswerService)

  useEffect(() => {
    const currentAnswers = surveyResults?.find((surveyAnswer) => surveyAnswer.surveyId === surveyId)
    setSurveyAnswers(currentAnswers)
  }, [surveyId, surveyResults])

  const completeSurvey = useCallback(
    (survey: SurveyModel, options: CompleteEvent) => {
      options.showSaveInProgress()
      const dataObj: SurveyAnswer = {
        surveyId: surveyId,
        organizationId: user?.organizationId ?? "",
        answerJson: JSON.stringify(survey.data),
      }

      if (surveyAnswerService) {
        surveyAnswerService
          .save(dataObj)
          .then(() => {
            options.showSaveSuccess()
          })
          .catch(() => {
            options.showSaveError()
          })
      }
    },
    [surveyAnswerService, surveyId, user?.organizationId],
  )

  const saveSurveyData = useCallback(
    (survey: SurveyModel) => {
      const data = survey.data
      if (!surveyAnswerService) {
        return
      }
      surveyAnswerService
        .save({
          id: surveyAnswers?.id,
          surveyId: surveyId,
          organizationId: user?.organizationId ?? "",
          answerJson: JSON.stringify(data),
        })
        .then((data) => {
          setSurveyAnswers(data)
          setResponseSaved(new Date())
        })
        .catch(() => {
          console.error("Failed to save survey data")
        })
    },
    [surveyAnswerService, surveyAnswers?.id, surveyId, user?.organizationId],
  )

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    )
  }

  const surveyModel = new Model(survey?.surveyJson)
  surveyModel.locale = i18n.language ?? "fi"
  surveyModel.applyTheme(surveyTheme)
  surveyModel.data = surveyAnswers?.answerJson ? JSON.parse(surveyAnswers.answerJson) : {}

  surveyModel.onCurrentPageChanged.add(saveSurveyData)
  surveyModel.onComplete.add(completeSurvey)
  surveyModel.onValueChanged.add(saveSurveyData)

  return (
    <Box sx={{ width: "100vw", overflow: "hidden" }}>
      <Survey model={surveyModel} />
      {responseSaved && (
        <Typography>Vastaukset tallennettu: {responseSaved.toLocaleString()}</Typography>
      )}
    </Box>
  )
}
