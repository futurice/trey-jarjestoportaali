import { useTranslation } from "react-i18next"
import { LocationOn, Business, MeetingRoom, Info } from "@mui/icons-material"
import { Card, CardContent, Typography, Box } from "@mui/material"
import { Facility } from "../../models/organization"
import { PersonCard } from "./PersonCard"

interface FacilityCardProps {
  readonly facility: Facility
}

export function FacilityCard({ facility }: FacilityCardProps) {
  const { t } = useTranslation()
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "stretch" }}>
      <Typography variant="h6" gutterBottom>
        {t("organization.facilities.label")}
      </Typography>
      <Card>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {facility.campus && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOn sx={{ fontSize: 20, color: "text.secondary" }} />
              <Box sx={{ alignItems: "flex-start", display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" color="text.secondary">
                  {t("organization.facilities.campus")}
                </Typography>
                <Typography>{facility.campus}</Typography>
              </Box>
            </Box>
          )}
          {facility.building && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Business sx={{ fontSize: 20, color: "text.secondary" }} />
              <Box sx={{ alignItems: "flex-start", display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" color="text.secondary">
                  {t("organization.facilities.building")}
                </Typography>
                <Typography>{facility.building}</Typography>
              </Box>
            </Box>
          )}
          {facility.roomCode && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MeetingRoom sx={{ fontSize: 20, color: "text.secondary" }} />
              <Box sx={{ alignItems: "flex-start", display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" color="text.secondary">
                  {t("organization.facilities.room")}
                </Typography>
                <Typography>{facility.roomCode}</Typography>
              </Box>
            </Box>
          )}
          {facility.otherInfo && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Info sx={{ fontSize: 20, color: "text.secondary" }} />
              <Box sx={{ alignItems: "flex-start", display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" color="text.secondary">
                  {t("organization.facilities.other_info")}
                </Typography>
                <Typography>{facility.otherInfo}</Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {facility.contactPerson && (
        <Box sx={{ mt: 2 }}>
          <PersonCard
            person={facility.contactPerson}
            title={t("organization.facilities.contact_person")}
          />
        </Box>
      )}
    </Box>
  )
}
