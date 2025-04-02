import { useState, useEffect, useCallback } from 'react';
import { Survey } from '../models/survey';
import { SurveyService } from '../services/surveyService';

export const useSurveys = (surveyService: SurveyService | null) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSurveys = useCallback(async () => {
    if (!surveyService) {
      setSurveys([]);
      setLoading(false);
      return;
    }

    try {
      const surveyList = await surveyService.getList();
      setSurveys(surveyList);
    } catch (error) {
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  }, [surveyService]);

  useEffect(() => {
    setLoading(true);
    fetchSurveys();
  }, [fetchSurveys]);

  return { surveys, loading };
}; 