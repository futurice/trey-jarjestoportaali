import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"
import { Person } from "@mui/icons-material"
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

interface NavigationRoute {
  name: string
  href: string
}

const navigationRoutes = [
  { name: "navigation.dashboard", href: "/dashboard" },
  { name: "navigation.files", href: "/my-files" },
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

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
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
          {navigationRoutes.map((route) => (
            <NavigationItem
              key={route.name}
              item={route}
              isOpen={location.pathname === route.href}
            />
          ))}
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <IconButton sx={{ p: 0 }} onClick={handleClick}>
            <Avatar>
              <Person />
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
      <ProfileMenu />
    </>
  )
}

export default Navigation
