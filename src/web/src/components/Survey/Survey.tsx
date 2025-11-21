import { useCallback, useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { Box, CircularProgress, Container, Typography } from "@mui/material"
import { CompleteEvent, getLocaleStrings } from "survey-core"
import "survey-core/i18n/finnish"
import "survey-core/survey-core.css"
import { Model, Survey, SurveyModel } from "survey-react-ui"
import { useAuth } from "../../authentication/AuthContext"
import { useSurveyAnswerService } from "../../hooks/useSurveyAnswerService"
import { useGetSurveyResults } from "../../hooks/useSurveyAnswers"
import { useSurveyService } from "../../hooks/useSurveyService"
import { useGetSurveyById } from "../../hooks/useSurveys"
import { SurveyAnswer } from "../../models/survey"
import "./Survey.css"
import surveyTheme from "./SurveyTheme"

export const SurveyPage = () => {
  const { surveyId } = useParams()
  const { treyUser, session } = useAuth()
  const { t, i18n } = useTranslation()

  const [surveyAnswerData, setSurveyAnswerData] = useState<SurveyAnswer | undefined>(undefined)
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyModel | undefined>(undefined)
  const [responseSaved, setResponseSaved] = useState<Date | undefined>(undefined)
  const sessionJwt = useMemo(() => session?.access_token, [session])
  const storageItemKey = `trey-${surveyId}-${treyUser?.organizationId ?? treyUser?.id}`

  const surveyService = useSurveyService(treyUser?.role, sessionJwt)
  if (!surveyId) {
    throw new Error("Survey ID is required")
  }
  const { survey, loading } = useGetSurveyById(surveyService, surveyId)

  const surveyAnswerService = useSurveyAnswerService(treyUser?.role, sessionJwt, surveyId)
  const { surveyResults } = useGetSurveyResults(surveyAnswerService)

  useEffect(() => {
    const prevData = window.localStorage.getItem(storageItemKey) || null
    const currentAnswers = surveyResults?.find((surveyAnswer) => surveyAnswer.surveyId === surveyId)
    setSurveyAnswerData(currentAnswers)
    if (currentAnswers?.answerJson) {
      setSurveyAnswers(JSON.parse(currentAnswers.answerJson))
    } else if (prevData) {
      const data = JSON.parse(prevData)
      setSurveyAnswers(data)
    }
  }, [storageItemKey, surveyId, surveyResults])

  // Hack to change the loading and completing survey messages
  useEffect(() => {
    const engLocale = getLocaleStrings("en")
    const finLocale = getLocaleStrings("fi")
    engLocale.loadingSurvey = "Loading..."
    engLocale.completingSurvey = "Thank you for your responses!"
    finLocale.loadingSurvey = "Ladataan..."
    finLocale.completingSurvey = "Kiitos vastauksistasi!"
    engLocale.saveData = "Save answers"
    finLocale.saveData = "Tallenna"
  }, [])

  const saveToLocalStorage = useCallback(
    (survey: SurveyModel) => {
      const data = survey.data
      data.pageNo = survey.currentPageNo
      window.localStorage.setItem(storageItemKey, JSON.stringify(data))
    },
    [storageItemKey],
  )

  const completeSurvey = useCallback(
    (survey: SurveyModel, options: CompleteEvent) => {
      options.showSaveInProgress()
      const dataObj: SurveyAnswer = {
        id: surveyAnswerData?.id,
        surveyId: surveyId,
        organizationId: treyUser?.organizationId ?? "",
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
    [surveyAnswerData?.id, surveyAnswerService, surveyId, treyUser?.organizationId],
  )

  const saveSurveyData = useCallback(
    (survey: SurveyModel) => {
      const data = survey.data
      data.pageNo = survey.currentPageNo ?? 0
      if (!data) {
        return
      }
      setSurveyAnswers(data)
      window.localStorage.setItem(storageItemKey, JSON.stringify(data))
      if (surveyAnswerService) {
        surveyAnswerService
          .save({
            id: surveyAnswerData?.id,
            surveyId: surveyId,
            organizationId: surveyAnswerData?.organizationId ?? treyUser?.organizationId ?? "",
            answerJson: JSON.stringify(data),
          })
          .then((response) => {
            setSurveyAnswerData(response)
            setResponseSaved(new Date())
            toast.success(t("responses_saved_to_server"))
          })
          .catch((e) => {
            console.error("Failed to save survey data")
            console.error(e)
            toast.error(t("responses_save_failed"))
          })
      }
    },
    [
      storageItemKey,
      surveyAnswerData?.id,
      surveyAnswerData?.organizationId,
      surveyAnswerService,
      surveyId,
      t,
      treyUser?.organizationId,
    ],
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

  surveyModel.addNavigationItem({
    id: "sv-nav-save",
    // To set the button text, use the `title` property  if you don't use localization:
    // title: "Clear Page",
    // ... or the `locTitleName` property if you do use localization:
    locTitleName: "saveData",
    action: () => {
      if (surveyModel) {
        saveSurveyData(surveyModel)
      }
    },
    css: "nav-button",
    innerCss: "sd-btn nav-input",
  })

  return (
    <Box sx={{ width: "100vw", overflow: "hidden", textAlign: "left" }}>
      <Survey model={surveyModel} />
      {responseSaved && (
        <Typography>
          {t("responses_saved")}: {responseSaved.toLocaleString()}
        </Typography>
      )}
    </Box>
  )
}
