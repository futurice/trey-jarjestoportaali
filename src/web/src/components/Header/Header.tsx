import React from "react"
import { AppBar } from "@mui/material"
import { Container } from "@radix-ui/themes"
import Navigation from "../Navigation/Navigation"

export const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ padding: "10px" }}>
      <Container maxWidth="xl">
        <Navigation />
      </Container>
    </AppBar>
  )
}
