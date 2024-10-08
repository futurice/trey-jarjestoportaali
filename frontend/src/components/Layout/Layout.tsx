import React from "react"
import { Container } from "@radix-ui/themes"
import { Header } from "../Header/Header"

interface ILayout {
  children: React.ReactNode
}

export const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <>
      <Header />
      <Container align="center">{children}</Container>
    </>
  )
}
