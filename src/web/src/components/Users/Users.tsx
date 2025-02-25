import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Badge, Container, Table } from "@radix-ui/themes"
import { getUsers } from "../../api/users"
import { Roles } from "../../authentication"
import { User } from "../../models/user"

const UserBadge = ({ role }: { role: Roles | undefined }) => {
  switch (role) {
    case Roles.ADMIN:
      return <Badge color="orange">Admin</Badge>
    case Roles.TREY_BOARD:
      return <Badge color="blue">TREY</Badge>
    case Roles.ORGANISATION:
      return <Badge color="green">Organisation</Badge>
    case Roles.PENDING_APPROVAL:
      return <Badge color="red">Pending Approval</Badge>
    default:
      return <Badge color="gray">Unknown</Badge>
  }
}

const UsersTable = ({ users }: { users: User[] }) => {
  return (
    <Container>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {users.map((user: User) => (
            <Table.Row key={user.userId}>
              <Table.Cell>{<UserBadge role={user.trustedMetadata?.role} />}</Table.Cell>
              <Table.Cell>
                <Link to={user.userId}>{user.emails[0].email}</Link>{" "}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Container>
  )
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data)
    })
  }, [])

  return (
    <Container>
      <h1>Users</h1>
      <UsersTable users={users} />
    </Container>
  )
}

export default Users
