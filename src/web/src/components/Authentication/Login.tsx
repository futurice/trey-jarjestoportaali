import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Navigate, useNavigate, Link } from "react-router-dom"
import { Person, VisibilityOff, Visibility, Lock } from "@mui/icons-material"
import { Alert, Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import JippoBW from "../../assets/JippoLogo"
import { useAuth } from "../../authentication/AuthContext"
import { LoginButton } from "../Button/LoginButton"
import { LoginCard } from "./LoginCard"
import { LoginContainer } from "./LoginContainer/LoginContainer"

const Login = () => {
  const { isLoading, signIn, session } = useAuth()

  if (session?.user) {
    return <Navigate to="/dashboard" />
  }

  return (
    <LoginContainer>
      <LoginComponent onLogin={signIn} isLoading={isLoading} error={undefined} />
    </LoginContainer>
  )
}

interface LoginFormProps {
  onLogin: ({
    username,
    password,
    callbackFunction,
  }: {
    username: string
    password: string
    callbackFunction: () => void
  }) => Promise<void>
  isLoading?: boolean
  error?: string
}

interface FormData {
  username: string
  password: string
}

export interface FormErrors {
  username?: string
  password?: string
}

const LoginComponent = ({ onLogin, isLoading = false, error }: LoginFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  })
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = t("login.error.username_required")
    }

    if (!formData.password) {
      newErrors.password = t("login.error.password_required")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const signInCallback = () => {
    navigate("/dashboard")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onLogin({
        username: formData.username,
        password: formData.password,
        callbackFunction: signInCallback,
      })
    }
  }

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <LoginCard>
      <Box textAlign="center" mb={4}>
        <JippoBW
          style={{
            width: "auto",
            height: 120,
          }}
        />
        <Typography variant="body1" color="text.secondary">
          {t("login.title")}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          id="Username"
          label={t("login.username")}
          variant="outlined"
          value={formData.username}
          onChange={handleInputChange("username")}
          error={!!errors.username}
          helperText={errors.username}
          disabled={isLoading}
          sx={{ mb: 3 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Person color={errors.username ? "error" : "action"} />
                </InputAdornment>
              ),
              sx: {
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#008996",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#008996",
                  },
                },
              },
            },
            inputLabel: {
              sx: {
                "&.Mui-focused": {
                  color: "#008996",
                },
              },
            },
          }}
        />

        <TextField
          fullWidth
          id="password"
          label={t("login.password")}
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={formData.password}
          onChange={handleInputChange("password")}
          error={!!errors.password}
          helperText={errors.password}
          disabled={isLoading}
          sx={{ mb: 3, boxShadow: "none" }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color={errors.password ? "error" : "action"} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    disabled={isLoading}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#008996",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#008996",
                  },
                },
              },
            },
            inputLabel: {
              sx: {
                "&.Mui-focused": {
                  color: "#008996",
                },
              },
            },
          }}
        />

        <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
          <Link
            to={{ pathname: "/forgot-password" }}
            style={{
              textDecoration: "none",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: "1em",
                color: "#008996",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("login.forgot_password")}
            </Typography>
          </Link>
        </Box>
        <LoginButton
          label={t("login.sign_in.label")}
          isLoading={isLoading}
          loadingText={t("login.sign_in.loading_text")}
        />
      </Box>
    </LoginCard>
  )
}

export default Login
