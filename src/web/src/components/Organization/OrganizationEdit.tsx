import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import {
  Add,
  Delete,
  Save,
  Cancel,
  ExpandMore,
  Person as PersonIcon,
  Business,
  Shield,
  MailOutline,
} from "@mui/icons-material"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Divider,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Container,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import { Roles } from "../../authentication"
import { useAuth } from "../../authentication/AuthContext"
import { useGetOrganizationById } from "../../hooks/useOrganizations"
import { useOrganizationsService } from "../../hooks/useOrganizationsService"
import { Category, Facility, Organization, Person } from "../../models/organization"
import { getCategoryLabel } from "../../utils/organizationUtils"

export function OrganizationEdit() {
  const { orgId } = useParams()
  const { session, treyUser } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const sessionJwt = useMemo(() => session?.access_token, [session])
  const organizationsService = useOrganizationsService(treyUser?.role, sessionJwt)
  const { data: organization, isFetching } = useGetOrganizationById(
    organizationsService,
    orgId,
    (treyUser?.role === Roles.ORGANISATION && treyUser?.organizationId === orgId) ||
      treyUser?.role === Roles.TREY_BOARD ||
      treyUser?.role === Roles.ADMIN,
  )

  const [formData, setFormData] = useState<Organization>(organization || ({} as Organization))
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const saveData = (organization: Organization) => {
    organizationsService?.save(organization).then((savedOrg) => {
      setFormData(savedOrg)
    })
  }

  // Helper to update nested fields
  const updateField = (field: keyof Organization, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Person field updates
  const updatePerson = (
    personField: "chairperson" | "intraRightsOwner",
    field: keyof Person,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [personField]: {
        ...(prev[personField] || { name: "" }),
        [field]: value,
      },
    }))
  }

  // Array person updates (board members, signature rights owners)
  const updateArrayPerson = (
    arrayField: "boardmembers" | "signatureRightsOwners",
    index: number,
    field: keyof Person,
    value: any,
  ) => {
    setFormData((prev) => {
      const array = [...(prev[arrayField] || [])]
      array[index] = { ...array[index], [field]: value }
      return { ...prev, [arrayField]: array }
    })
  }

  const addArrayPerson = (arrayField: "boardmembers" | "signatureRightsOwners") => {
    setFormData((prev) => ({
      ...prev,
      [arrayField]: [...(prev[arrayField] || []), { name: "" }],
    }))
  }

  const removeArrayPerson = (
    arrayField: "boardmembers" | "signatureRightsOwners",
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [arrayField]: (prev[arrayField] || []).filter((_, i) => i !== index),
    }))
  }

  // Facility updates
  const updateFacility = (field: keyof Facility, value: any) => {
    setFormData((prev) => ({
      ...prev,
      associationFacility: {
        ...(prev.associationFacility || {}),
        [field]: value,
      },
    }))
  }

  const updateFacilityContactPerson = (field: keyof Person, value: any) => {
    setFormData((prev) => ({
      ...prev,
      associationFacility: {
        ...(prev.associationFacility || {}),
        contactPerson: {
          ...(prev.associationFacility?.contactPerson || { name: "" }),
          [field]: value,
        },
      },
    }))
  }

  // Reservation emails
  const addReservationEmail = () => {
    setFormData((prev) => ({
      ...prev,
      reservationRightsEmails: [...(prev.reservationRightsEmails || []), ""],
    }))
  }

  const updateReservationEmail = (index: number, value: string) => {
    setFormData((prev) => {
      const emails = [...(prev.reservationRightsEmails || [])]
      emails[index] = value
      return { ...prev, reservationRightsEmails: emails }
    })
  }

  const removeReservationEmail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      reservationRightsEmails: (prev.reservationRightsEmails || []).filter((_, i) => i !== index),
    }))
  }

  // Email lists
  const addEmailList = () => {
    setFormData((prev) => ({
      ...prev,
      emailLists: {
        ...(prev.emailLists || {}),
        "New List": [],
      },
    }))
  }

  const updateEmailListName = (oldName: string, newName: string) => {
    setFormData((prev) => {
      const lists = { ...(prev.emailLists || {}) }
      const emails = lists[oldName]
      delete lists[oldName]
      lists[newName] = emails
      return { ...prev, emailLists: lists }
    })
  }

  const removeEmailList = (listName: string) => {
    setFormData((prev) => {
      const lists = { ...(prev.emailLists || {}) }
      delete lists[listName]
      return { ...prev, emailLists: lists }
    })
  }

  const addEmailToList = (listName: string) => {
    setFormData((prev) => {
      const lists = { ...(prev.emailLists || {}) }
      lists[listName] = [...(lists[listName] || []), ""]
      return { ...prev, emailLists: lists }
    })
  }

  const updateEmailInList = (listName: string, index: number, value: string) => {
    setFormData((prev) => {
      const lists = { ...(prev.emailLists || {}) }
      const emails = [...(lists[listName] || [])]
      emails[index] = value
      lists[listName] = emails
      return { ...prev, emailLists: lists }
    })
  }

  const removeEmailFromList = (listName: string, index: number) => {
    setFormData((prev) => {
      const lists = { ...(prev.emailLists || {}) }
      lists[listName] = (lists[listName] || []).filter((_, i) => i !== index)
      return { ...prev, emailLists: lists }
    })
  }

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Organization name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.chairperson.name.trim()) {
      newErrors.chairperson = "Chairperson name is required"
    }

    if (formData.memberCount < 0) {
      newErrors.memberCount = "Member count cannot be negative"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validate()) {
      saveData(formData)
      navigate("..", { relative: "path" })
    }
  }

  const handleCancel = () => {
    navigate("..", { relative: "path" })
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h4">Edit Organization</Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          }
        />
      </Card>

      {/* Validation Errors */}
      {Object.keys(errors).length > 0 && (
        <Alert severity="error">
          <Typography variant="subtitle2">Please fix the following errors:</Typography>
          <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader title={<Typography variant="h6">Basic Information</Typography>} />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                required
                label="Organization Name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Short Name"
                value={formData.shortName || ""}
                onChange={(e) => updateField("shortName", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category ?? ""}
                  onChange={(e) => updateField("category", e.target.value as Category)}
                  label="Category"
                >
                  <MenuItem value={Category.FacultyAndUmbrella}>
                    {getCategoryLabel(Category.FacultyAndUmbrella, t)}
                  </MenuItem>
                  <MenuItem value={Category.Hobby}>{getCategoryLabel(Category.Hobby, t)}</MenuItem>
                  <MenuItem value={Category.StudentAssociation}>
                    {getCategoryLabel(Category.StudentAssociation, t)}
                  </MenuItem>
                  <MenuItem value={Category.Other}>{getCategoryLabel(Category.Other, t)}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Founding Year"
                value={formData.foundingYear || ""}
                onChange={(e) =>
                  updateField("foundingYear", Number.parseInt(e.target.value) || undefined)
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Website"
                type="url"
                value={formData.website || ""}
                onChange={(e) => updateField("website", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Member Count"
                value={formData.memberCount}
                onChange={(e) => updateField("memberCount", Number.parseInt(e.target.value) || 0)}
                error={!!errors.memberCount}
                helperText={errors.memberCount}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="TREY Member Count"
                value={formData.treyMemberCount || ""}
                onChange={(e) =>
                  updateField("treyMemberCount", Number.parseInt(e.target.value) || undefined)
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="IBAN"
                value={formData.iban || ""}
                onChange={(e) => updateField("iban", e.target.value)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Operating Period
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Start Date"
                type="datetime-local"
                value={
                  formData.operatingPeriod.start ? formData.operatingPeriod.start.slice(0, 16) : ""
                }
                onChange={(e) =>
                  updateField("operatingPeriod", {
                    ...formData.operatingPeriod,
                    start: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="End Date"
                type="datetime-local"
                value={
                  formData.operatingPeriod.end ? formData.operatingPeriod.end.slice(0, 16) : ""
                }
                onChange={(e) =>
                  updateField("operatingPeriod", {
                    ...formData.operatingPeriod,
                    end: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* People Section */}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon />
              <Typography variant="h6">People</Typography>
            </Box>
          }
        />
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Chairperson */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Chairperson *
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Name"
                  value={formData.chairperson.name}
                  onChange={(e) => updatePerson("chairperson", "name", e.target.value)}
                  error={!!errors.chairperson}
                  helperText={errors.chairperson}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.chairperson.email || ""}
                  onChange={(e) => updatePerson("chairperson", "email", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.chairperson.phone || ""}
                  onChange={(e) => updatePerson("chairperson", "phone", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Telegram Nick"
                  value={formData.chairperson.telegramNick || ""}
                  onChange={(e) => updatePerson("chairperson", "telegramNick", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", alignItems: "center" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.chairperson.hasBankingAccount || false}
                      onChange={(e) =>
                        updatePerson("chairperson", "hasBankingAccount", e.target.checked)
                      }
                    />
                  }
                  label="Has Banking Account"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Intra Rights Owner */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Intra Rights Owner</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={formData.intraRightsOwner?.name || ""}
                    onChange={(e) => updatePerson("intraRightsOwner", "name", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.intraRightsOwner?.email || ""}
                    onChange={(e) => updatePerson("intraRightsOwner", "email", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.intraRightsOwner?.phone || ""}
                    onChange={(e) => updatePerson("intraRightsOwner", "phone", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Telegram Nick"
                    value={formData.intraRightsOwner?.telegramNick || ""}
                    onChange={(e) =>
                      updatePerson("intraRightsOwner", "telegramNick", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", alignItems: "center" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.intraRightsOwner?.hasBankingAccount || false}
                        onChange={(e) =>
                          updatePerson("intraRightsOwner", "hasBankingAccount", e.target.checked)
                        }
                      />
                    }
                    label="Has Banking Account"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Board Members */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">
                Board Members ({formData.boardmembers?.length || 0})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {formData.boardmembers?.map((member, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Chip label={`Member ${index + 1}`} size="small" />
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeArrayPerson("boardmembers", index)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Name"
                            value={member.name}
                            onChange={(e) =>
                              updateArrayPerson("boardmembers", index, "name", e.target.value)
                            }
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={member.email || ""}
                            onChange={(e) =>
                              updateArrayPerson("boardmembers", index, "email", e.target.value)
                            }
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <TextField
                            fullWidth
                            label="Phone"
                            value={member.phone || ""}
                            onChange={(e) =>
                              updateArrayPerson("boardmembers", index, "phone", e.target.value)
                            }
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <TextField
                            fullWidth
                            label="Telegram Nick"
                            value={member.telegramNick || ""}
                            onChange={(e) =>
                              updateArrayPerson(
                                "boardmembers",
                                index,
                                "telegramNick",
                                e.target.value,
                              )
                            }
                          />
                        </Grid>
                        <Grid
                          size={{ xs: 12, md: 4 }}
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={member.hasBankingAccount || false}
                                onChange={(e) =>
                                  updateArrayPerson(
                                    "boardmembers",
                                    index,
                                    "hasBankingAccount",
                                    e.target.checked,
                                  )
                                }
                              />
                            }
                            label="Has Banking Account"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => addArrayPerson("boardmembers")}
                >
                  Add Board Member
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Signature Rights Owners */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">
                Signature Rights Owners ({formData.signatureRightsOwners?.length || 0})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {formData.signatureRightsOwners?.map((owner, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Chip label={`Owner ${index + 1}`} size="small" />
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeArrayPerson("signatureRightsOwners", index)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Name"
                            value={owner.name}
                            onChange={(e) =>
                              updateArrayPerson(
                                "signatureRightsOwners",
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={owner.email || ""}
                            onChange={(e) =>
                              updateArrayPerson(
                                "signatureRightsOwners",
                                index,
                                "email",
                                e.target.value,
                              )
                            }
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <TextField
                            fullWidth
                            label="Phone"
                            value={owner.phone || ""}
                            onChange={(e) =>
                              updateArrayPerson(
                                "signatureRightsOwners",
                                index,
                                "phone",
                                e.target.value,
                              )
                            }
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <TextField
                            fullWidth
                            label="Telegram Nick"
                            value={owner.telegramNick || ""}
                            onChange={(e) =>
                              updateArrayPerson(
                                "signatureRightsOwners",
                                index,
                                "telegramNick",
                                e.target.value,
                              )
                            }
                          />
                        </Grid>
                        <Grid
                          size={{ xs: 12, md: 4 }}
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={owner.hasBankingAccount || false}
                                onChange={(e) =>
                                  updateArrayPerson(
                                    "signatureRightsOwners",
                                    index,
                                    "hasBankingAccount",
                                    e.target.checked,
                                  )
                                }
                              />
                            }
                            label="Has Banking Account"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => addArrayPerson("signatureRightsOwners")}
                >
                  Add Signature Rights Owner
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>

      {/* Facility Section */}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Business />
              <Typography variant="h6">Facility</Typography>
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Campus"
                value={formData.associationFacility?.campus || ""}
                onChange={(e) => updateFacility("campus", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Building"
                value={formData.associationFacility?.building || ""}
                onChange={(e) => updateFacility("building", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Room Code"
                value={formData.associationFacility?.roomCode || ""}
                onChange={(e) => updateFacility("roomCode", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Other Info"
                value={formData.associationFacility?.otherInfo || ""}
                onChange={(e) => updateFacility("otherInfo", e.target.value)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Contact Person
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Name"
                value={formData.associationFacility?.contactPerson?.name || ""}
                onChange={(e) => updateFacilityContactPerson("name", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.associationFacility?.contactPerson?.email || ""}
                onChange={(e) => updateFacilityContactPerson("email", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.associationFacility?.contactPerson?.phone || ""}
                onChange={(e) => updateFacilityContactPerson("phone", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Telegram Nick"
                value={formData.associationFacility?.contactPerson?.telegramNick || ""}
                onChange={(e) => updateFacilityContactPerson("telegramNick", e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Permissions Section */}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Shield />
              <Typography variant="h6">Permissions</Typography>
            </Box>
          }
        />
        <CardContent>
          <Box
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}
          >
            <Typography variant="subtitle1">
              Reservation Rights Emails ({formData.reservationRightsEmails?.length || 0})
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={addReservationEmail}
            >
              Add Email
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {formData.reservationRightsEmails?.map((email, index) => (
              <Box key={index} sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  label={`Email ${index + 1}`}
                  type="email"
                  value={email}
                  onChange={(e) => updateReservationEmail(index, e.target.value)}
                />
                <IconButton color="error" onClick={() => removeReservationEmail(index)}>
                  <Delete />
                </IconButton>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Communications Section */}
      <Card>
        <CardHeader
          title={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MailOutline />
                <Typography variant="h6">Communications</Typography>
              </Box>
              <Button variant="outlined" startIcon={<Add />} onClick={addEmailList}>
                Add Email List
              </Button>
            </Box>
          }
        />
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {Object.entries(formData.emailLists || {}).map(([listName, emails]) => (
              <Card key={listName} variant="outlined">
                <CardContent>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="List Name"
                      value={listName}
                      onChange={(e) => updateEmailListName(listName, e.target.value)}
                    />
                    <IconButton color="error" onClick={() => removeEmailList(listName)}>
                      <Delete />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {emails.map((email, index) => (
                      <Box key={index} sx={{ display: "flex", gap: 1 }}>
                        <TextField
                          fullWidth
                          label={`Email ${index + 1}`}
                          type="email"
                          value={email}
                          onChange={(e) => updateEmailInList(listName, index, e.target.value)}
                        />
                        <IconButton
                          color="error"
                          onClick={() => removeEmailFromList(listName, index)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => addEmailToList(listName)}
                    >
                      Add Email to List
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Save/Cancel Footer */}
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" startIcon={<Save />} onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
