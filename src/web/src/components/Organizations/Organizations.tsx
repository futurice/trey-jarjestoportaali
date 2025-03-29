import { useEffect, useState } from "react"
import { Container, Table } from "@radix-ui/themes"
import { Organization } from "../../models/organization"
import config from "../../config";
import {OrganizationService} from "../../services/organizationService.ts";

// TODO: Implement final component
const OrganizationsTable = ({ organizations }: { organizations: Organization[] }) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {organizations.map((organization) => (
          <Table.Row key={organization.id}>
            <Table.Cell>{organization.name}</Table.Cell>
            <Table.Cell>{organization.email}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}

export const Organizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([])

  useEffect(() => {
    const organizationService = new OrganizationService(
      config.api.baseUrl,
      "organizations"
    );

    const fetchData = async () => {
      const result = await organizationService.getList();
      setOrganizations(result)
    }
    fetchData()
  }, [])

  return (
    <Container align="center">
      <h1>Organizations</h1>
      <OrganizationsTable organizations={organizations} />
    </Container>
  )
}
