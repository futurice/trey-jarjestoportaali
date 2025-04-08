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

  const [surveyAnswerData, setSurveyAnswerData] = useState<SurveyAnswer | undefined>(undefined)
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyModel | undefined>(undefined)
  const [responseSaved, setResponseSaved] = useState<Date | undefined>(undefined)
  const sessionJwt = useMemo(() => session?.getTokens()?.session_jwt, [session])
  const storageItemKey = `trey-${surveyId}-${user?.organizationId ?? user?.id}`
  
  const surveyService = useSurveyService(user?.role, sessionJwt)
  if (!surveyId) {
    throw new Error("Survey ID is required")
  }
  const { survey, loading } = useGetSurveyById(surveyService, surveyId)

  const surveyAnswerService = useSurveyAnswerService(user?.role, sessionJwt, surveyId)
  const { surveyResults } = useGetSurveyResults(surveyAnswerService)

  useEffect(() => {
    const prevData = window.localStorage.getItem(storageItemKey) || null;
    const currentAnswers = surveyResults?.find((surveyAnswer) => surveyAnswer.surveyId === surveyId)
    setSurveyAnswerData(currentAnswers)
    if (currentAnswers?.answerJson) {
      setSurveyAnswers(currentAnswers?.answerJson ? JSON.parse(currentAnswers?.answerJson) : {})
    } else if (prevData) {
      const data = JSON.parse(prevData);
      setSurveyAnswers(data);
    }
  }, [storageItemKey, surveyId, surveyResults])

  const saveToLocalStorage = (survey: SurveyModel) => {
    const data = survey.data;
    data.pageNo = survey.currentPageNo;
    window.localStorage.setItem(storageItemKey, JSON.stringify(data));
}

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
      data.pageNo = survey.currentPageNo
      setSurveyAnswers(data)
      if (!surveyAnswerService) {
        return
      }
      surveyAnswerService
        .save({
          id: surveyAnswerData?.id,
          surveyId: surveyId,
          organizationId: surveyAnswerData?.organizationId ?? user?.organizationId ?? "",
          answerJson: JSON.stringify(data),
        })
        .then((response) => {
          setSurveyAnswerData(response)
          setResponseSaved(new Date())
        })
        .catch(() => {
          console.error("Failed to save survey data")
        })
    },
    [surveyAnswerData?.id, surveyAnswerData?.organizationId, surveyAnswerService, surveyId, user?.organizationId],
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
  surveyModel.data = surveyAnswers ?? {}
  if (surveyAnswers?.pageNo) {
    surveyModel.currentPageNo = surveyAnswers?.pageNo
  }

  surveyModel.onCurrentPageChanged.add(saveSurveyData)
  surveyModel.onComplete.add(completeSurvey)
  surveyModel.onValueChanged.add(saveToLocalStorage)

  return (
    <Box sx={{ width: "100vw", overflow: "hidden", textAlign: "left" }}>
      <Survey model={surveyModel} />
      {responseSaved && (
        <Typography>Vastaukset tallennettu: {responseSaved.toLocaleString()}</Typography>
      )}
    </Box>
  )
}
