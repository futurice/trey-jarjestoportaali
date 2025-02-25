import { Roles } from "../authentication"

export interface User {
  createdAt: string
  emails: {
    email: string
    emailId: string
    verified: boolean
  }[]
  name?: {
    firstName?: string
    lastName?: string
    middleName?: string
  }
  trustedMetadata?: {
    role?: Roles
  }
  untrustedMetadata?: Record<string, unknown>
  status: "active" | "pending"
  userId: string
}
