import { useMemo } from 'react';
import { SurveyService } from '../services/surveyService';
import { Roles } from '../authentication';
import config from '../config';

export const useSurveyService = (role: Roles | undefined, authToken: string | undefined) => {
  return useMemo(() => {
    if (!role || !authToken) {
      return null;
    }
    return new SurveyService(config.api.baseUrl, role, authToken);
  }, [role, authToken]);
}; 