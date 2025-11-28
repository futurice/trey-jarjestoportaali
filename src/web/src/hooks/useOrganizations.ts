import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Roles } from "../authentication"
import { TreyUser } from "../authentication/AuthContext"
import { Organization } from "../models/organization"
import { OrganizationService } from "../services/organizationService"

export const useGetOrganizationById = (
  organizationsService: OrganizationService | null,
  organizationId: string | undefined,
  enabled = true,
) => {
  return useQuery<Organization, AxiosError>({
    queryKey: ["organization", organizationId],
    queryFn: async () => {
      return await organizationsService!.get(organizationId!)
    },
    enabled: !!organizationId && !!organizationsService && enabled,
  })
}

export const useOrganizations = (
  organizationsService: OrganizationService | null,
  treyUser: TreyUser | null,
) => {
  return useQuery<Organization[], AxiosError>({
    queryKey: ["organizations"],
    queryFn: async () => {
      return await organizationsService!.getList()
    },
    enabled:
      !!organizationsService &&
      (treyUser?.role === Roles.ADMIN || treyUser?.role === Roles.TREY_BOARD),
  })
}
