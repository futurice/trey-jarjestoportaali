import { Container } from "@mui/material"
import styles from "./Logincontainer.module.css"

interface ILoginContainer {
  children: React.ReactNode
}

export const LoginContainer: React.FC<ILoginContainer> = ({ children }) => {
  return (
    <Container className={styles["login-container"]} maxWidth="sm">
      {children}
    </Container>
  )
}
