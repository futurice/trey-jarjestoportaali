import React from "react"
import { Header } from "../Header/Header"
import styles from "./Layout.module.css"

interface ILayout {
  children: React.ReactNode
}

export const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <>
      <Header />
      <div className={styles["page-container"]}>{children}</div>
    </>
  )
}
