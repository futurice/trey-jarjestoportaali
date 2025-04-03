import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"
import { Language, Person } from "@mui/icons-material"
import Logout from "@mui/icons-material/Logout"
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  useTheme,
} from "@mui/material"
import { useStytchUser } from "@stytch/react"
import TreyLogo from "../../assets/TreyLogo"
import { Roles } from "../../authentication/Roles"
import i18n from "../../i18n"

interface NavigationRoute {
  name: string
  href: string
  allowedRoles?: Roles[]
}

const navigationRoutes = [
  { name: "navigation.dashboard", href: "/dashboard" },
  { name: "navigation.files", href: "/my-files" },
  {
    name: "navigation.organizations",
    href: "/organizations",
    allowedRoles: [Roles.ADMIN, Roles.TREY_BOARD],
  },
] as NavigationRoute[]

const NavigationItem = ({ item, isOpen }: { item: NavigationRoute; isOpen: boolean }) => {
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <Button
      component={RouterLink}
      to={item.href}
      sx={{
        my: 2,
        textTransform: "none",
        display: "block",
        color: isOpen ? `${theme.palette.secondary.main}` : "white",
        fontSize: "16px",
        textDecoration: isOpen ? "underline" : "none",
        "&:hover": {
          textDecoration: isOpen ? "underline" : "none",
        },
      }}
    >
      {t(item.name)}
    </Button>
  )
}

const Navigation = () => {
  const location = useLocation()
  const { user } = useStytchUser()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [lngAnchorEl, setLngAnchorEl] = useState<null | HTMLElement>(null)

  const userRole = useMemo(() => (user?.trusted_metadata.role as Roles) ?? Roles.NONE, [user])

  const lngOpen = Boolean(lngAnchorEl)
  const handleLngClick = (event: React.MouseEvent<HTMLElement>) => {
    setLngAnchorEl(event.currentTarget)
  }
  const handleLngClose = () => {
    setLngAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
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
              mt: 1.5,
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 30,
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
          onClick={() => i18n.changeLanguage("fi")}
          sx={{ fontWeight: i18n.language === "fi" ? "bold" : "regular" }}
        >
          <ListItemIcon>🇫🇮</ListItemIcon>
          {t("language.fi")}
        </MenuItem>
        <MenuItem
          onClick={() => i18n.changeLanguage("en")}
          sx={{ fontWeight: i18n.language === "en" ? "bold" : "regular" }}
        >
          <ListItemIcon>🇬🇧</ListItemIcon>
          {t("language.en")}
        </MenuItem>
      </Menu>
    )
  }

  const ProfileMenu = () => {
    return user ? (
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => navigate("/logout")}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t("logout")}
        </MenuItem>
      </Menu>
    ) : null
  }

  return (
    <>
      <Toolbar disableGutters sx={{ ml: 1, mr: 1 }}>
        <Link href="/dashboard">
          <TreyLogo sx={{ fontSize: 120, mr: 4, height: "auto" }} />
        </Link>
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          {navigationRoutes
            .filter((route) => !route.allowedRoles || route.allowedRoles.includes(userRole))
            .map((route) => (
              <NavigationItem
                key={route.name}
                item={route}
                isOpen={location.pathname === route.href}
              />
            ))}
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <IconButton className="languageMenuButton" sx={{ p: 1 }} onClick={handleLngClick}>
            <Language sx={{ color: "white", fontSize: "2rem" }} />
          </IconButton>
          <IconButton sx={{ p: 1 }} onClick={handleClick}>
            <Avatar>
              <Person />
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
      <LngMenu />
      <ProfileMenu />
    </>
  )
}

export default Navigation
