import { useCallback, useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { CircularProgress, Container, Typography } from "@mui/material"
import { CompleteEvent, getLocaleStrings, UploadFilesEvent } from "survey-core"
import "survey-core/i18n/finnish"
import "survey-core/survey-core.css"
import { Model, Survey, SurveyModel } from "survey-react-ui"
import { useAuth } from "../../authentication/AuthContext"
import { useFileService } from "../../hooks/useFileService"
import { useGetOrganizationById } from "../../hooks/useOrganizations"
import { useOrganizationsService } from "../../hooks/useOrganizationsService"
import { useSurveyAnswerService } from "../../hooks/useSurveyAnswerService"
import { useGetSurveyResults } from "../../hooks/useSurveyAnswers"
import { useSurveyService } from "../../hooks/useSurveyService"
import { useGetSurveyById } from "../../hooks/useSurveys"
import { CachedSurveyState, SurveyAnswer, SurveyType } from "../../models/survey"
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
  const { surveyResults, loading: isLoadingSurveyResults } =
    useGetSurveyResults(surveyAnswerService)
  const organizationsService = useOrganizationsService(treyUser?.role, sessionJwt)
  const { data: organization, isFetching: isFetchingOrganization } = useGetOrganizationById(
    organizationsService,
    treyUser?.organizationId || "",
    !!treyUser?.organizationId && survey?.surveyType === SurveyType.AssociationAnnouncement,
  )
  const fileService = useFileService(sessionJwt)

  useEffect(() => {
    if (loading || isLoadingSurveyResults) return
    const rawCache = globalThis.localStorage.getItem(storageItemKey) || null
    let cached: CachedSurveyState | null = null
    if (rawCache) {
      try {
        cached = JSON.parse(rawCache)
        // basic sanity checks
        if (cached?.surveyId !== surveyId) {
          cached = null
        }
      } catch (e) {
        console.warn("Failed to parse cached survey data", e)
        cached = null
      }
    }
    const currentAnswers = surveyResults?.find((surveyAnswer) => surveyAnswer.surveyId === surveyId)
    const cachedAnswerJson = cached ? JSON.parse(cached.answerJson) : null
    if (currentAnswers?.answerJson) {
      const serverData = JSON.parse(currentAnswers.answerJson)
      const serverUpdatedAt = currentAnswers.updatedAt
        ? new Date(currentAnswers.updatedAt).getTime()
        : 0

      const cacheUpdatedAt = cached?.updatedAt ? new Date(cached.updatedAt).getTime() : 0

      // pick whichever is newer
      if (cached && cacheUpdatedAt > serverUpdatedAt) {
        setSurveyAnswerData(currentAnswers)
        setSurveyAnswers({ ...cachedAnswerJson, pageNo: cachedAnswerJson.pageNo })
      } else {
        setSurveyAnswerData(currentAnswers)
        setSurveyAnswers(serverData)
      }
    } else if (cached) {
      // no server data yet, but we have a local cache
      setSurveyAnswers({ ...cachedAnswerJson, pageNo: cachedAnswerJson.pageNo })
    }
  }, [isLoadingSurveyResults, loading, storageItemKey, surveyId, surveyResults])

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
      const cache: CachedSurveyState = {
        surveyId,
        organizationId: treyUser?.organizationId ?? treyUser?.id,
        answerJson: JSON.stringify(survey.data),
        updatedAt: new Date().toISOString(),
      }
      globalThis.localStorage.setItem(storageItemKey, JSON.stringify(cache))
    },
    [storageItemKey, surveyId, treyUser?.id, treyUser?.organizationId],
  )

  const completeSurvey = useCallback(
    (survey: SurveyModel, options: CompleteEvent) => {
      options.showSaveInProgress()
      const dataObj: SurveyAnswer = {
        id: surveyAnswerData?.id,
        surveyId: surveyId,
        organizationId: treyUser?.organizationId ?? "",
        answerJson: JSON.stringify(survey.data),
        updatedAt: new Date(),
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
      if (!data) {
        return
      }
      data.pageNo = survey.currentPageNo ?? 0
      saveToLocalStorage(survey)
      setSurveyAnswers(data)
      if (surveyAnswerService) {
        surveyAnswerService
          .save({
            id: surveyAnswerData?.id,
            surveyId: surveyId,
            organizationId: surveyAnswerData?.organizationId ?? treyUser?.organizationId ?? "",
            answerJson: JSON.stringify(data),
            updatedAt: new Date(),
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
      saveToLocalStorage,
      surveyAnswerData?.id,
      surveyAnswerData?.organizationId,
      surveyAnswerService,
      surveyId,
      t,
      treyUser?.organizationId,
    ],
  )

  const uploadFilesEvent = useCallback(
    (survey: Model, options: UploadFilesEvent) => {
      const formData = new FormData()
      for (const file of options.files) {
        formData.append(file.name, file)
      }
      fileService
        .uploadMany(formData)
        .then((fileResponses) => {
          if (fileResponses?.data) {
            options.callback(
              options.files.map((file, index) => {
                const uploadedFile = fileResponses.data[index]
                return {
                  file: file,
                  content: uploadedFile.uri || "",
                }
              }),
              [],
            )
          } else {
            console.error("File upload error: No data in response")
            options.callback([], ["error"])
          }
        })
        .then(() => {
          saveSurveyData(survey)
        })
        .catch((error) => {
          console.error("File upload error:", error)
          options.callback([], ["error"])
        })
    },
    [fileService, saveSurveyData],
  )

  const deleteFileEvent = useCallback(
    async (fileId: string) => {
      try {
        const fullFileName = `${treyUser?.organizationId ?? treyUser?.id ?? "unknown"}/${fileId}`
        const response = await fileService.deleteFileById(fullFileName)

        if (response.status === 204) {
          return "success"
        } else {
          console.error(`Failed to delete file: ${fileId}`)
          return "error"
        }
      } catch (error) {
        console.error("Error while deleting file: ", error)
        return "error"
      }
    },
    [fileService, treyUser?.id, treyUser?.organizationId],
  )

  const surveyModel = useMemo(() => {
    const model = new Model(survey?.surveyJson)
    model.locale = i18n.language ?? "fi"
    model.applyTheme(surveyTheme)
    model.data = surveyAnswers ?? {}
    if (surveyAnswers?.pageNo) {
      model.currentPageNo = surveyAnswers?.pageNo
    }
    model.onUploadFiles.add(uploadFilesEvent)
    model.onCurrentPageChanged.add(saveSurveyData)
    model.onComplete.add(completeSurvey)
    model.onValueChanged.add(saveToLocalStorage)

    model.onClearFiles.add(async (survey, options) => {
      if (!options.value || options.value.length === 0) {
        return options.callback("success")
      }

      const filesToDelete = options.fileName
        ? options.value.filter((item: { name?: string }) => item.name === options.fileName)
        : options.value

      if (filesToDelete.length === 0) {
        return options.callback("error")
      }
      const fileNames = filesToDelete
        .map((file: { content?: string }) =>
          file.content && typeof file.content === "string"
            ? file.content.split("/").pop()
            : undefined,
        )
        .filter((name: unknown) => typeof name === "string" && name.length > 0)
      const results = await Promise.all(fileNames.map((file: string) => deleteFileEvent(file)))

      if (results.every((res) => res === "success")) {
        options.callback("success")
      } else {
        options.callback("error")
      }
      saveSurveyData(survey)
    })

    model.addNavigationItem({
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
    return model
  }, [
    survey?.surveyJson,
    i18n.language,
    surveyAnswers,
    uploadFilesEvent,
    saveSurveyData,
    completeSurvey,
    saveToLocalStorage,
    deleteFileEvent,
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      saveSurveyData(surveyModel)
    }, 300000)

    return () => clearInterval(interval)
  }, [saveSurveyData, surveyModel])

  useEffect(() => {
    if (
      !surveyAnswerData &&
      survey?.surveyType === SurveyType.AssociationAnnouncement &&
      organization &&
      !isFetchingOrganization &&
      !isLoadingSurveyResults
    ) {
      surveyModel.data = {
        ...surveyModel.data,
        organizationName: organization?.name || undefined,
        boardEmail: organization?.email || undefined,
        memberCount: organization?.memberCount || undefined,
        treyMemberCount: organization?.treyMemberCount || undefined,
        hasAssociationFacility: !!organization.associationFacility,
        campus: organization.associationFacility?.campus || undefined,
        building: organization.associationFacility?.building || undefined,
        roomCode: organization.associationFacility?.roomCode || undefined,
      }
    }
  }, [
    organization,
    survey,
    surveyId,
    surveyResults,
    storageItemKey,
    surveyModel.data,
    surveyModel,
    isFetchingOrganization,
    surveyAnswerData,
    isLoadingSurveyResults,
    saveSurveyData,
  ])

  if (loading || isLoadingSurveyResults) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        overflow: "hidden",
        textAlign: "left",
      }}
    >
      <Survey model={surveyModel} />
      {responseSaved && (
        <Typography>
          {t("responses_saved")}: {responseSaved.toLocaleString()}
        </Typography>
      )}
    </Container>
  )
}
