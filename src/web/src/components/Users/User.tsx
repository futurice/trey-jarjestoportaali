import { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import {
  Button,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Dialog,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Box,
} from "@mui/material"
import { ArrowLeftIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { Container, DataList } from "@radix-ui/themes"
import { getUser } from "../../api/users"
import { Roles } from "../../authentication"
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

const UserModal = ({
  open,
  close,
  user,
}: {
  open: boolean
  close: () => void
  user: User | null
}) => {
  return user ? (
    <Dialog open={open} onClose={close} sx={{ display: "flex", justifyContent: "center" }}>
      <DialogTitle>User details</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 2, minWidth: "500px" }}>
          <FormControl>
            <TextField
              label="User ID"
              defaultValue={user.userId}
              sx={{ width: "100%" }}
              placeholder="User ID"
              disabled
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Email"
              defaultValue={user.emails[0].email}
              sx={{ width: "100%" }}
              placeholder="Email"
            />
          </FormControl>

          <FormControl>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={user.trustedMetadata?.role}
              label="Role"
              onChange={(e) => console.log(e)}
            >
              {Object.values(Roles).map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Close</Button>
      </DialogActions>
    </Dialog>
  ) : (
    <></>
  )
}

const UserPage = () => {
  const { userId } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)

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
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
      >
        <Pencil1Icon />
        <Typography>Edit</Typography>
      </Button>
      <UserInfo user={user} />
      <UserModal open={open} close={() => setOpen(false)} user={user} />
    </Container>
  ) : (
    <Container>Loading...</Container>
  )
}
export default UserPage
