import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { Box, CircularProgress, TextField, Typography } from "@mui/material"
import { RequestResponse, useAuth } from "../../authentication/AuthContext"
import { LoginButton } from "../Button/LoginButton"
import { LoginCard } from "./LoginCard"
import { LoginContainer } from "./LoginContainer/LoginContainer"

const ForgotPassword = () => {
  const { isLoading, session, forgotPasswordRequest } = useAuth()

  if (session?.user) {
    return <Navigate to="/dashboard" />
  }

  return (
    <LoginContainer>
      <ForgotPasswordComponent onResetPassword={forgotPasswordRequest} isLoading={isLoading} />
    </LoginContainer>
  )
}

interface FormData {
  email: string
}

export interface FormErrors {
  email?: string
}

const ForgotPasswordComponent = ({
  onResetPassword,
  isLoading = false,
}: {
  onResetPassword: (email: string) => Promise<RequestResponse>
  isLoading?: boolean
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [resetResponse, setResetResponse] = useState<RequestResponse | null>(null)
  const navigate = useNavigate()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onResetPassword(formData.email).then((response) => {
        if (response) {
          setResetResponse(response)
        }
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

  return (
    <LoginCard
      style={{
        minHeight: 400,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {resetResponse ? (
        <Box textAlign="center" px={2}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #008996, #006069)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            {resetResponse.success ? "Email Sent" : "Error"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {resetResponse.message ||
              (resetResponse.success
                ? "Please check your email for the password reset link."
                : "There was an issue processing your request. Please try again.")}
          </Typography>
          <LoginButton
            label="Return to login"
            isLoading={false}
            loadingText=""
            onClick={() => navigate("/login")}
            sx={{ mt: 4 }}
          />
        </Box>
      ) : (
        <>
          {isLoading ? (
            <Box
              sx={{
                textAlign: "center",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
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
                  Reset password
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Forgot your account's password? Enter your email address and we'll send you a
                  recovery link.
                </Typography>
              </Box>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  fullWidth
                  id="Email"
                  label="Email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={isLoading}
                  sx={{ mb: 3 }}
                  slotProps={{
                    input: {
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

                <LoginButton
                  label="Request new password"
                  isLoading={isLoading}
                  loadingText="Requesting..."
                />
              </Box>
            </>
          )}
        </>
      )}
    </LoginCard>
  )
}

export default ForgotPassword
