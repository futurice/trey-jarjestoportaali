import { useState, useEffect, useCallback } from "react"
import { Survey } from "../models/survey"
import { SurveyService } from "../services/surveyService"

export const useSurveys = (surveyService: SurveyService | null) => {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSurveys = useCallback(async () => {
    if (!surveyService) {
      setSurveys([])
      setLoading(false)
      return
    }

    try {
      const surveyList = await surveyService.getList()
      setSurveys(surveyList)
    } catch (error) {
      setSurveys([])
    } finally {
      setLoading(false)
    }
  }, [surveyService])

  useEffect(() => {
    setLoading(true)
    fetchSurveys()
  }, [fetchSurveys])

  return { surveys, loading }
}

export const useGetSurveyById = (SurveyService: SurveyService | null, surveyId: string) => {
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSurvey = useCallback(async () => {
    if (!SurveyService) {
      setSurvey(null)
      setLoading(false)
      return
    }

    try {
      const survey = await SurveyService.get(surveyId)
      setSurvey(survey)
    } catch (error) {
      setSurvey(null)
    } finally {
      setLoading(false)
    }
  }, [SurveyService, surveyId])

  useEffect(() => {
    setLoading(true)
    fetchSurvey()
  }, [fetchSurvey])

  return { survey, loading }
}
