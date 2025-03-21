import React from "react"
import { Box, Container } from "@mui/material"
import { Header } from "../Header/Header"

interface ILayout {
  children: React.ReactNode
}

export const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <Box sx={{ width: "100vw", display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <Container sx={{ backgroundColor: "white", minWidth: "100vw", pb: 5 }}>{children}</Container>
    </Box>
  )
}
