import { Container, Typography } from "@mui/material"
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next"
import ErrorIcon from '@mui/icons-material/Error';
import { Layout } from "../Layout/Layout";

export const ErrorWrapper = () => {
  return (
    <Layout>
      <Container sx={{ pb: "2rem" }}>
        <Outlet />
      </Container>
    </Layout>
  )
}

export const NoOrganization = () => {
  const { t } = useTranslation()
  return (
    <>
      <ErrorIcon sx={{ fontSize: 80, color: "#c20000" }} />
      <Typography variant="h3" component="h1" sx={{ mb: "1rem" }}>{t("no_organization.title")}</Typography>
      <Typography>{t("no_organization.error")}</Typography>
      <Typography>{t("no_organization.error2")}</Typography>
    </>
  )
}