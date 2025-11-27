import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  CalendarToday,
  Email,
  Language,
  People,
  AccountBalance,
  CalendarMonth,
  Business,
  Shield,
  MailOutline,
  ArrowDropDownSharp,
  ArrowBack,
} from "@mui/icons-material"
import {
  Container,
  Box,
  Card,
  CardHeader,
  Typography,
  Chip,
  CardContent,
  Grid,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  AccordionSummary,
  AccordionDetails,
  styled,
  IconButton,
} from "@mui/material"
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion"
import { Roles } from "../../authentication"
import { useAuth } from "../../authentication/AuthContext"
import { useGetOrganizationById } from "../../hooks/useOrganizations"
import { useOrganizationsService } from "../../hooks/useOrganizationsService"
import { getCategoryLabel } from "../../utils/organizationUtils"
import { FacilityCard } from "./FacilityCard"
import { PersonCard } from "./PersonCard"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props
  return (
    <Box role="tabpanel" hidden={value !== index} {...other} sx={{ width: "100%" }}>
      {value === index && <Box sx={{ py: 3, width: "100%" }}>{children}</Box>}
    </Box>
  )
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&::before": {
    display: "none",
  },
  borderRadius: "4px",
  "&.Mui-expanded": {
    margin: "auto",
  },
}))

function formatDate(dateString?: string): string {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return `${date.getMonth() + 1}/${date.getFullYear()}`
}

export const OrganizationPage = () => {
  const { orgId } = useParams()
  const { t } = useTranslation()
  const { session, treyUser } = useAuth()
  const navigate = useNavigate()

  const sessionJwt = useMemo(() => session?.access_token, [session])
  const organizationsService = useOrganizationsService(treyUser?.role, sessionJwt)
  const { data: organization, isFetching } = useGetOrganizationById(
    organizationsService,
    orgId,
    (treyUser?.role === Roles.ORGANISATION && treyUser?.organizationId === orgId) ||
      treyUser?.role === Roles.TREY_BOARD ||
      treyUser?.role === Roles.ADMIN,
  )

  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    if (treyUser?.role === Roles.ORGANISATION && treyUser?.organizationId !== orgId) {
      navigate("/dashboard")
    }
  }, [orgId, navigate, treyUser?.organizationId, treyUser?.role])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  if (isFetching) {
    return (
      <Container>
        <Typography variant="h6" color="text.secondary">
          {t("loading")}
        </Typography>
        <CircularProgress />
      </Container>
    )
  }
  if (!organization) {
    return (
      <Container>
        <Typography variant="h6" color="text.secondary">
          {t("organization.error.not_found")}
        </Typography>
      </Container>
    )
  }

  return (
    <Container>
      <Box sx={{ position: "absolute", top: 100, right: 20 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          <ArrowBack />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Card>
          <CardHeader
            title={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="h4">{organization.name}</Typography>
                  {organization.shortName && (
                    <Typography variant="h5" color="text.secondary" sx={{ mt: 0.5 }}>
                      ({organization.shortName})
                    </Typography>
                  )}
                </Box>
                {organization.category !== undefined && (
                  <Chip
                    label={getCategoryLabel(organization.category, t)}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            }
          />
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Grid container spacing={3}>
              {organization.foundingYear && (
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 20, color: "text.secondary" }} />
                    <Box
                      sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {t("organization.founding_year")}
                      </Typography>
                      <Typography>{organization.foundingYear}</Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Email sx={{ fontSize: 20, color: "text.secondary" }} />
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <Typography variant="body2" color="text.secondary">
                      {t("organization.email")}
                    </Typography>
                    <Link to={`mailto:${organization.email}`}>{organization.email}</Link>
                  </Box>
                </Box>
              </Grid>

              {organization.website && (
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Language sx={{ fontSize: 20, color: "text.secondary" }} />
                    <Box
                      sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {t("organization.website")}
                      </Typography>
                      <Link to={organization.website} target="_blank" rel="noopener noreferrer">
                        {organization.website}
                      </Link>
                    </Box>
                  </Box>
                </Grid>
              )}

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <People sx={{ fontSize: 20, color: "text.secondary" }} />
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <Typography variant="body2" color="text.secondary">
                      {t("organization.member_count")}
                    </Typography>
                    <Typography>{organization.memberCount}</Typography>
                  </Box>
                </Box>
              </Grid>

              {organization.treyMemberCount !== undefined && (
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <People sx={{ fontSize: 20, color: "text.secondary" }} />
                    <Box
                      sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {t("organization.trey_members")}
                      </Typography>
                      <Typography>{organization.treyMemberCount}</Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {organization.iban && (
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccountBalance sx={{ fontSize: 20, color: "text.secondary" }} />
                    <Box
                      sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        IBAN
                      </Typography>
                      <Typography sx={{ fontFamily: "monospace" }}>{organization.iban}</Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>

            <Divider />

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <CalendarMonth sx={{ fontSize: 20, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  {t("organization.operating_period.label")}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  ml: 3.5,
                }}
              >
                <Typography>
                  {t("organization.operating_period.start")}:{" "}
                  {formatDate(organization.operatingPeriod.start)}
                </Typography>
                <Typography>
                  {t("organization.operating_period.end")}:{" "}
                  {formatDate(organization.operatingPeriod.end)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Card>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab icon={<People />} iconPosition="start" label={t("organization.tabs.board")} />
            <Tab
              icon={<Business />}
              iconPosition="start"
              label={t("organization.tabs.facilities")}
            />
            <Tab
              icon={<Shield />}
              iconPosition="start"
              label={t("organization.tabs.permissions")}
            />
            <Tab
              icon={<MailOutline />}
              iconPosition="start"
              label={t("organization.tabs.communications")}
            />
          </Tabs>

          {/* People Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, px: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <PersonCard
                    person={organization.chairperson}
                    title={t("organization.board.chairperson")}
                  />
                </Grid>

                {organization.intraRightsOwner && (
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <PersonCard
                      person={organization.intraRightsOwner}
                      title={t("organization.board.intra_rights_owner")}
                    />
                  </Grid>
                )}
              </Grid>

              {organization.boardmembers && organization.boardmembers.length > 0 && (
                <Accordion sx={{ width: "100%" }}>
                  <AccordionSummary expandIcon={<ArrowDropDownSharp sx={{ fontSize: 30 }} />}>
                    <Typography variant="h6">{t("organization.board.board_members")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {organization.boardmembers.map((member, index) => (
                        <Grid
                          size={{ xs: 12, md: 6 }}
                          key={`board-member-${member.email}-${index}`}
                        >
                          <PersonCard person={member} />
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              )}

              {organization.signatureRightsOwners &&
                organization.signatureRightsOwners.length > 0 && (
                  <Accordion sx={{ width: "100%" }}>
                    <AccordionSummary expandIcon={<ArrowDropDownSharp sx={{ fontSize: 30 }} />}>
                      <Typography variant="h6">
                        {t("organization.board.signature_rights_owners")}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {organization.signatureRightsOwners.map((owner, index) => (
                          <Grid
                            size={{ xs: 12, md: 6 }}
                            key={`signature-rights-owner-${owner.email}-${index}`}
                          >
                            <PersonCard person={owner} />
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )}
            </Box>
          </TabPanel>

          {/* Facility Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 2 }}>
              {organization.associationFacility ? (
                <FacilityCard facility={organization.associationFacility} />
              ) : (
                <Card variant="outlined">
                  <CardContent sx={{ py: 8, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      No facility information available
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          </TabPanel>

          {/* Permissions Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ px: 2, display: "flex", flexDirection: "column", gap: 3 }}>
              {organization.reservationRightsEmails &&
              organization.reservationRightsEmails.length > 0 ? (
                <Card variant="outlined">
                  <CardHeader title={<Typography variant="h6">Reservation Rights</Typography>} />
                  <CardContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {organization.reservationRightsEmails.map((email, index) => (
                        <Box
                          key={`email-${email}-${index}`}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            p: 1.5,
                            bgcolor: "action.hover",
                            borderRadius: 1,
                          }}
                        >
                          <Email sx={{ fontSize: 20, color: "text.secondary" }} />
                          <Link to={`mailto:${email}`}>{email}</Link>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <Card variant="outlined">
                  <CardContent sx={{ py: 8, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      No permission information available
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          </TabPanel>

          {/* Communications Tab */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ px: 2 }}>
              {organization.emailLists && Object.keys(organization.emailLists).length > 0 ? (
                <Card variant="outlined">
                  <CardHeader title={<Typography variant="h6">Email Lists</Typography>} />
                  <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {Object.entries(organization.emailLists).map(([listName, emails], index) => (
                      <Box
                        key={`email-list-${listName}-${index}`}
                        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                      >
                        <Typography variant="subtitle1">{listName}</Typography>
                        <Box sx={{ ml: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                          {emails.map((email, emailIndex) => (
                            <Box
                              key={`email-${email}-${emailIndex}`}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                p: 1.5,
                                bgcolor: "action.hover",
                                borderRadius: 1,
                              }}
                            >
                              <Email sx={{ fontSize: 20, color: "text.secondary" }} />
                              <Link to={`mailto:${email}`}>{email}</Link>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card variant="outlined">
                  <CardContent sx={{ py: 8, textAlign: "center" }}>
                    <Typography color="text.secondary">No email lists available</Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          </TabPanel>
        </Card>
      </Box>
    </Container>
  )
}
