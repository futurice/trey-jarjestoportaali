import { NavLink } from "react-router-dom"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { Container } from "@mui/material"
import styles from "./SubPage.module.css"

interface ILayout {
  children: React.ReactNode
  rootUrl?: string
}

const SubPage: React.FC<ILayout> = ({ children, rootUrl }) => {
  return (
    <Container sx={{ padding: 1 }}>
      <NavLink className={styles.backarrow} to={rootUrl || "/dashboard"}>
        <ArrowBackIcon width="32" height="32" />
      </NavLink>
      {children}
    </Container>
  )
}
export default SubPage
