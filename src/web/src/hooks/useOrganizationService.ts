import { useMemo } from "react"
import { Roles } from "../authentication"
import config from "../config"
import { OrganizationService } from "../services/organizationService"

export const useOrganizationService = (role: Roles | undefined, authToken: string | undefined) => {
  return useMemo(() => {
    if (!role || !authToken) {
      return null
    }
    return new OrganizationService(config.api.baseUrl, role, authToken)
  }, [role, authToken])
}
