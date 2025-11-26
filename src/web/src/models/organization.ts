export enum Category {
  FacultyAndUmbrella = 0,
  Hobby = 1,
  StudentAssociation = 2,
  Other = 3,
}

export interface Person {
  name: string
  email?: string
  phone?: string
  telegramNick?: string
  hasBankingAccount?: boolean
}

export interface Facility {
  campus?: string
  building?: string
  roomCode?: string
  contactPerson?: Person
  otherInfo?: string
}

export interface TimeRange {
  start?: string
  end?: string
}

export interface Organization {
  id: string
  category?: Category
  website?: string
  name: string
  shortName?: string
  foundingYear?: number
  operatingPeriod: TimeRange
  email: string
  chairperson: Person
  boardmembers?: Person[]
  signatureRightsOwners?: Person[]
  intraRightsOwner?: Person
  memberCount: number
  treyMemberCount?: number
  iban?: string
  reservationRightsEmails?: string[]
  emailLists?: Record<string, string[]>
  associationFacility?: Facility
}
