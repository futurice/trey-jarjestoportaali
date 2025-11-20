import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { Person, VisibilityOff, Visibility, Lock } from "@mui/icons-material"
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link,
} from "@mui/material"
import { useAuth } from "../authentication/AuthContext"
import { LoginContainer } from "../components/LoginContainer/LoginContainer"
import { LoginButton } from "./Button/LoginButton"

const Login = () => {
  const { isLoading, signIn, session } = useAuth()

  if (isLoading) {
    return <CircularProgress />
  } else if (session?.user) {
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

  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username or email is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
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
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #008996, #006069)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your account
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
              label="Username"
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
              label="Password"
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
                href="/forgot-password"
                variant="body2"
                sx={{
                  color: "#008996",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>
            <LoginButton label="Sign in" isLoading={isLoading} loadingText="Signing In..." />
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Login
