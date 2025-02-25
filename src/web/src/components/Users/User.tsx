import { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { Container, DataList } from "@radix-ui/themes"
import { getUser } from "../../api/users"
import { User } from "../../models/user"
import styles from "./User.module.css"

const UserInfo = ({ user }: { user: User }) => {
  return (
    <DataList.Root>
      <DataList.Item key={user.userId}>
        <DataList.Label>Id</DataList.Label>
        <DataList.Value>{user.userId}</DataList.Value>
      </DataList.Item>
      <DataList.Item key={user.emails[0].email}>
        <DataList.Label>Email</DataList.Label>
        <DataList.Value>{user.emails[0].email}</DataList.Value>
      </DataList.Item>
    </DataList.Root>
  )
}

const UserPage = () => {
  const { userId } = useParams()
  console.log(userId)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!userId) {
      return
    }
    getUser(userId).then((data) => {
      setUser(data)
    })
  }, [userId])

  return user ? (
    <Container>
      <NavLink className={styles.backarrow} to="/users">
        <ArrowLeftIcon width="32" height="32" />
      </NavLink>
      <h2>{user?.emails[0].email}</h2>
      <UserInfo user={user} />
    </Container>
  ) : (
    <Container>Loading...</Container>
  )
}
export default UserPage
