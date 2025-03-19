import { useEffect, useState } from "react"
import { Container, Table } from "@radix-ui/themes"
import { getOrganizations } from "../../api/organizations"
import { Organization } from "../../models/organization"

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
    const fetchData = async () => {
      const result = await getOrganizations()
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
