import React from "react"
import treylogo from "../../../public/treylogo-navigation.svg"
import Navigation from "../Navigation/Navigation"
import styles from "./Header.module.css"

export const Header: React.FC = () => {
  return (
    <header className={styles["header"]}>
      <div className={styles["image-container"]}>
        <img src={treylogo} alt="TREY-logo" />
      </div>
      <Navigation />
    </header>
  )
}
