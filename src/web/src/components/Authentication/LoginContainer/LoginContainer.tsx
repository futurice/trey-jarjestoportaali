import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Language } from "@mui/icons-material"
import { Box, Container, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material"
import { t } from "i18next"
import i18n from "../../../i18n"
import styles from "./Logincontainer.module.css"

interface ILoginContainer {
  children: React.ReactNode
}

export const LoginContainer: React.FC<ILoginContainer> = ({ children }) => {
  const navigate = useNavigate()
  const [lngAnchorEl, setLngAnchorEl] = useState<null | HTMLElement>(null)

  const lngOpen = Boolean(lngAnchorEl)
  const handleLngClick = (event: React.MouseEvent<HTMLElement>) => {
    setLngAnchorEl(event.currentTarget)
  }
  const handleLngClose = () => {
    setLngAnchorEl(null)
  }

  const LngMenu = () => {
    return (
      <Menu
        anchorEl={lngAnchorEl}
        id="lng-menu"
        open={lngOpen}
        onClose={handleLngClose}
        onClick={handleLngClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1,
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                left: 13,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            i18n.changeLanguage("fi")
            navigate(0)
          }}
          sx={{ fontWeight: i18n.language === "fi" ? "bold" : "regular" }}
        >
          <ListItemIcon>🇫🇮</ListItemIcon>
          {t("language.fi")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            i18n.changeLanguage("en")
            navigate(0)
          }}
          sx={{ fontWeight: i18n.language === "en" ? "bold" : "regular" }}
        >
          <ListItemIcon>🇬🇧</ListItemIcon>
          {t("language.en")}
        </MenuItem>
      </Menu>
    )
  }

  return (
    <>
      <Box sx={{ top: 10, left: 10, position: "absolute", zIndex: 100 }} className="sentry-mask">
        <IconButton
          className="languageMenuButton"
          aria-label="Change language"
          sx={{ p: 1 }}
          onClick={handleLngClick}
        >
          <Language sx={{ color: "white", fontSize: "2rem" }} />
        </IconButton>
      </Box>
      <LngMenu />
      <Container className={styles["login-container"]} maxWidth="sm">
        {children}
      </Container>
    </>
  )
}
