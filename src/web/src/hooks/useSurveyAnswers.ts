import { useState, useCallback, useEffect } from "react"
import { SurveyAnswer } from "../models/survey"
import { SurveyAnswerService } from "../services/surveyAnswerService"

export const usePostSurveyResult = (
  SurveyAnswerService: SurveyAnswerService | null,
  surveyAnswer: SurveyAnswer,
) => {
  const [surveyResult, setSurveyResult] = useState<SurveyAnswer | null>(null)
  const [loading, setLoading] = useState(true)

  const postSurveyResult = useCallback(async () => {
    if (!SurveyAnswerService) {
      setSurveyResult(null)
      setLoading(false)
      return
    }

    try {
      const survey = await SurveyAnswerService.save(surveyAnswer)
      setSurveyResult(survey)
    } catch (error) {
      setSurveyResult(null)
    } finally {
      setLoading(false)
    }
  }, [SurveyAnswerService, surveyAnswer])

  useEffect(() => {
    setLoading(true)
    postSurveyResult()
  }, [postSurveyResult])

  return { surveyResult, loading }
}

export const useGetSurveyResults = (SurveyAnswerService: SurveyAnswerService | null) => {
  const [surveyResults, setSurveyResults] = useState<SurveyAnswer[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSurveyResults = useCallback(async () => {
    if (!SurveyAnswerService) {
      setSurveyResults([])
      setLoading(false)
      return
    }

    try {
      const surveyResults = await SurveyAnswerService.getAnswersByOrg()
      setSurveyResults(surveyResults)
    } catch (error) {
      setSurveyResults([])
    } finally {
      setLoading(false)
    }
  }, [SurveyAnswerService])

  useEffect(() => {
    setLoading(true)
    fetchSurveyResults()
  }, [fetchSurveyResults])

  return { surveyResults, loading }
}
