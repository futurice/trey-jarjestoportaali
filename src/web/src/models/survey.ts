export enum SurveyLanguage {
  En = 'En',
  Fi = 'Fi',
}

export interface Survey {
  id?: string;
  name: Record<SurveyLanguage, string>;
  surveyJson?: string;
}

export interface SurveyAnswer {
  id?: string;
  surveyId: string;
  organizationId?: string;
  answerJson?: string;
}
