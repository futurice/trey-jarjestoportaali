import { Roles } from "../authentication"
import { Organization } from "../models/organization.ts"
import { RestService } from "./restService.ts"

export class OrganizationService extends RestService<Organization> {
  public readonly baseUrl: string
  public readonly role: Roles
  public readonly authToken: string

  public constructor(baseUrl: string, role: Roles, authToken: string) {
    const baseRoute = "organizations"
    super(baseUrl, baseRoute, authToken)
    this.baseUrl = baseUrl
    this.role = role
    this.authToken = authToken
  }
}
