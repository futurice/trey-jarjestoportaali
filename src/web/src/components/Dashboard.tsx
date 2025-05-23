import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  ListItemButton,
} from "@mui/material"
import { useStytch } from "@stytch/react"
import { useAuth } from "../hooks/useAuth"
import { useSurveyService } from "../hooks/useSurveyService"
import { useSurveys } from "../hooks/useSurveys"
import { SurveyLanguage } from "../models/survey"

const Dashboard = () => {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { session } = useStytch()

  const sessionJwt = useMemo(() => session?.getTokens()?.session_jwt, [session])

  const surveyService = useSurveyService(user?.role, sessionJwt)
  const { surveys, loading } = useSurveys(surveyService)

  // Get the current language code and map it to SurveyLanguage
  const currentLanguage = useMemo(() => {
    return i18n.language === "fi" ? SurveyLanguage.Fi : SurveyLanguage.En
  }, [i18n.language])

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {t("dashboard.title")}
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t("dashboard.availableSurveys")}
        </Typography>
        {loading ? (
          <Typography>{t("common.loading")}</Typography>
        ) : surveys?.length === 0 ? (
          <Typography>{t("dashboard.noSurveys")}</Typography>
        ) : (
          <List>
            {surveys?.map((survey) => {
              const responsePeriodStart = survey.responsePeriod?.start && new Date(survey.responsePeriod?.start).toLocaleDateString("fi-FI");
              const responsePeriodEnd = survey.responsePeriod?.end && new Date(survey.responsePeriod?.end).toLocaleDateString("fi-FI");
              return (
                <ListItemButton component={Link} to={`/survey/${survey.id}`} key={survey.id}>
                  <ListItem key={survey.id} divider>
                    <ListItemText
                      primary={survey.name[currentLanguage]}
                      secondary={responsePeriodStart && responsePeriodEnd ? `${responsePeriodStart} - ${responsePeriodEnd}` : ""}
                    />
                  </ListItem>
                </ListItemButton>
              )
            })}
          </List>
        )}
      </Paper>
    </Container>
  )
}

export default Dashboard
