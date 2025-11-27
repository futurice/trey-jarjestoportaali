import { useState, useEffect, useCallback } from "react"
import { User } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Organization } from "../models/organization"
import { OrganizationService } from "../services/organizationService"

export const useOrganizations = (organizationsService: OrganizationService | null) => {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrganizations = useCallback(async () => {
    if (!organizationsService) {
      setOrganizations([])
      setLoading(false)
      return
    }

    try {
      const organizationList = await organizationsService.getList()
      setOrganizations(organizationList)
    } catch {
      setOrganizations([])
    } finally {
      setLoading(false)
    }
  }, [organizationsService])

  useEffect(() => {
    setLoading(true)
    fetchOrganizations()
  }, [fetchOrganizations])

  return { organizations, loading }
}

export const useGetOrganizationByUser = (
  organizationsService: OrganizationService | null,
  user: User | null,
) => {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const fetchOrganization = useCallback(async () => {
    if (!organizationsService || !user) {
      setOrganization(null)
      setLoading(false)
      return
    }

    try {
      const userOrganizationId = user.user_metadata?.organization_id
      if (userOrganizationId) {
        const org = await organizationsService.get(userOrganizationId)
        setOrganization(org)
      } else {
        setOrganization(null)
      }
    } catch {
      setOrganization(null)
    } finally {
      setLoading(false)
    }
  }, [organizationsService, user])

  useEffect(() => {
    setLoading(true)
    fetchOrganization()
  }, [fetchOrganization])

  return { organization, loading }
}

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
    enabled: (!!organizationId || !!organizationsService) && enabled,
  })
}
