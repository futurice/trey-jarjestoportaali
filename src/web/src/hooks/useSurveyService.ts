import { useMemo } from 'react';
import type { Roles } from '../authentication';
import config from '../config';
import { SurveyService } from '../services/surveyService';

export const useSurveyService = (role: Roles | undefined, authToken: string | undefined) => {
  return useMemo(() => {
    if (!role || !authToken) {
      return null;
    }
    return new SurveyService(config.api.baseUrl, role, authToken);
  }, [role, authToken]);
};
