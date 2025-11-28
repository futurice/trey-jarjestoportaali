import { useTranslation } from "react-i18next"
import { Mail, Phone, Send } from "@mui/icons-material"
import { Card, CardContent, CardHeader, Typography, Box, Link } from "@mui/material"
import { Person } from "../../models/organization"

interface PersonCardProps {
  person: Person
  title?: string
}

export function PersonCard({ person, title }: Readonly<PersonCardProps>) {
  const { t } = useTranslation()
  return (
    <Card
      sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", height: "100%" }}
    >
      {title && <CardHeader title={<Typography variant="h6">{title}</Typography>} sx={{ pb: 1 }} />}
      <CardContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Typography variant="body2" color="text.secondary">
            {t("organization.board.name")}
          </Typography>
          <Typography>{person.name}</Typography>
        </Box>

        {person.email && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Mail sx={{ fontSize: 20, color: "text.secondary" }} />
            <Link href={`mailto:${person.email}`} underline="hover">
              {person.email}
            </Link>
          </Box>
        )}

        {person.phone && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Phone sx={{ fontSize: 20, color: "text.secondary" }} />
            <Link href={`tel:${person.phone}`} underline="hover" color="inherit">
              {person.phone}
            </Link>
          </Box>
        )}

        {person.telegramNick && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Send sx={{ fontSize: 20, color: "text.secondary" }} />
            <Typography>@{person.telegramNick}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
