export enum Category {
  facultyAndUmbrella = "FacultyAndUmbrella",
  hobby = "Hobby",
  studentAssociation = "StudentAssociation",
  other = "Other",
}

export interface Person {
  name: string
  email?: string | null
  phone?: string | null
  telegramNick?: string | null
  hasBankingAccount?: boolean | null
}

export interface Facility {
  campus?: string | null
  building?: string | null
  roomCode?: string | null
  contactPerson?: Person | null
  otherInfo?: string | null
}

export interface TimeRange {
  start: string // Assuming DateTime translates to string in ISO format.
  end: string // Assuming DateTime translates to string in ISO format.
}

export interface Organization {
  id: string
  category?: Category | null
  website?: string | null
  name: string
  shortName?: string | null
  foundingYear?: number | null
  operatingPeriod: TimeRange
  email: string
  chairperson: Person
  boardmembers?: Person[] | null
  signatureRightsOwners?: Person[] | null
  intraRightsOwner?: Person | null
  memberCount: number
  treyMemberCount?: number | null
  iban?: string | null
  reservationRightsEmails?: string[] | null
  emailLists?: { [key: string]: string[] } | null
  associationFacility?: Facility | null
}
