import { useTranslation } from "react-i18next"
import { Container } from "@mui/material"
import { ApplicationForm } from "./ApplicationForm/ApplicationForm"

const Dashboard = () => {
  const { t } = useTranslation()
  return (
    <Container>
      <h1>{t("form.create")}</h1>
      <ApplicationForm />
    </Container>
  )
}

export default Dashboard
