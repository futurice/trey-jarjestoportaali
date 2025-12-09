export enum SurveyLanguage {
  En = "En",
  Fi = "Fi",
}

interface TimeRange {
  start?: Date
  end?: Date
}

export enum SurveyType {
  AssociationAnnouncement,
  OperationalGrant,
  Other,
}

export interface Survey {
  id?: string
  name: Record<SurveyLanguage, string>
  surveyJson?: string
  surveyType: SurveyType
  responsePeriod?: TimeRange
}

export interface SurveyAnswer {
  id?: string
  surveyId: string
  organizationId?: string
  answerJson?: string
}
