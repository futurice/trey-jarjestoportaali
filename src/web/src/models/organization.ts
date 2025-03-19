export interface Person {
  name: string;
  email?: string | null;
  phone?: string | null;
  telegramNick?: string | null;
}

export interface Facility {
  roomCode?: string | null;
  contactPerson?: Person | null;
  otherInfo?: string | null;
}

export interface TimeRange {
  start: string; // ISO 8601 date-time string
  end: string;   // ISO 8601 date-time string
}

export interface Organization {
  id: string; // UUID string
  name: string; // Name of the organization
  shortName?: string | null; // Lyhennetty versio tosi pitkästä nimestä
  foundingYear?: number | null; // Perustusvuosi, ei pakollinen
  operatingPeriod: TimeRange; // Toimintakauden aikaväli, date picker
  email: string;
  chairperson: Person;
  boardmembers?: Person[] | null;
  memberCount: number;
  treyMemberCount?: number | null;
  iban?: string | null;
  reservationRightsEmails?: string[] | null;
  emailLists?: { [key: string]: string } | null;
  associationFacility?: Facility | null;
}