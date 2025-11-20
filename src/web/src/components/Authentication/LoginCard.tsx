import { Container, Card, CardContent } from "@mui/material"

export const LoginCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container maxWidth="sm">
      <Card
        elevation={24}
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 4,
          overflow: "visible",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            background: "linear-gradient(45deg, #008996, #006069)",
            borderRadius: "inherit",
            zIndex: -1,
            opacity: 0.1,
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>{children}</CardContent>
      </Card>
    </Container>
  )
}
