import { useState, useEffect, useCallback } from "react"
import { Organization } from "../models/organization"
import { OrganizationService } from "../services/organizationService"

export const useOrganizations = (organizationService: OrganizationService | null) => {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrganizations = useCallback(async () => {
    if (!organizationService) {
      setOrganizations([])
      setLoading(false)
      return
    }

    try {
      const organizationList = await organizationService.getList()
      setOrganizations(organizationList)
    } catch (error) {
      setOrganizations([])
    } finally {
      setLoading(false)
    }
  }, [organizationService])

  useEffect(() => {
    setLoading(true)
    fetchOrganizations()
  }, [fetchOrganizations])

  return { organizations, loading }
}
