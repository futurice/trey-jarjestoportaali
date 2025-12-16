import { useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { VisibilityOff, Visibility } from "@mui/icons-material"
import { Box, Container, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import { useAuth } from "../../authentication/AuthContext"
import { LoginButton } from "../Button/LoginButton"

interface ChangePasswordData {
  newPassword: string
  newPasswordRepeat: string
}

export interface ChangePasswordErrors {
  newPassword?: string
  newPasswordRepeat?: string
}

export const ChangePassword = () => {
  const { isLoading, resetPassword } = useAuth()
  const { t } = useTranslation()
  const [formData, setFormData] = useState<ChangePasswordData>({
    newPassword: "",
    newPasswordRepeat: "",
  })
  const [errors, setErrors] = useState<ChangePasswordErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: ChangePasswordErrors = {}

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = t("reset_password.error_message.password_required")
    }

    if (!formData.newPasswordRepeat.trim()) {
      newErrors.newPasswordRepeat = t("reset_password.error_message.repeat_password_required")
    } else if (formData.newPassword !== formData.newPasswordRepeat) {
      newErrors.newPasswordRepeat = t("reset_password.error_message.passwords_do_not_match")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      resetPassword(formData.newPassword).then((response) => {
        if (response.success) {
          toast.success(t("reset_password.success.message"))
        } else {
          setErrors({ newPassword: response.message })
          toast.error(t("reset_password.error_message.generic") + ": " + response.message)
        }
      })
    }
  }

  const handleInputChange =
    (field: keyof ChangePasswordData) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleClickShowPasswordRepeat = () => {
    setShowPasswordRepeat(!showPasswordRepeat)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <Container maxWidth="sm">
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
          {t("reset_password.title")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("reset_password.instructions")}
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          id="NewPassword"
          type={showPassword ? "text" : "password"}
          label={t("reset_password.new_password_label")}
          variant="outlined"
          value={formData.newPassword}
          onChange={handleInputChange("newPassword")}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          disabled={isLoading}
          sx={{ mb: 3 }}
          slotProps={{
            input: {
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
          label={t("reset_password.confirm_password_label")}
          type={showPasswordRepeat ? "text" : "password"}
          variant="outlined"
          value={formData.newPasswordRepeat}
          onChange={handleInputChange("newPasswordRepeat")}
          error={!!errors.newPasswordRepeat}
          helperText={errors.newPasswordRepeat}
          disabled={isLoading}
          sx={{ mb: 3, boxShadow: "none" }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPasswordRepeat}
                    onMouseDown={handleMouseDownPassword}
                    disabled={isLoading}
                    edge="end"
                  >
                    {showPasswordRepeat ? <VisibilityOff /> : <Visibility />}
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

        <LoginButton
          label={t("reset_password.submit")}
          isLoading={isLoading}
          loadingText={t("reset_password.loading")}
        />
      </Box>
    </Container>
  )
}
