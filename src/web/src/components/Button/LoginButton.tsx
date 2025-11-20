import { Box, Button, CircularProgress } from "@mui/material"

export const LoginButton = ({
  label,
  isLoading,
  loadingText,
}: {
  label: string
  isLoading: boolean
  loadingText: string
}) => {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      disabled={isLoading}
      sx={{
        py: 1.5,
        borderRadius: 2,
        background: "linear-gradient(45deg, #008996, #006069)",
        boxShadow: "0 4px 20px rgba(0, 137, 150, 0.4)",
        textTransform: "none",
        fontSize: "1rem",
        fontWeight: 600,
        "&:hover": {
          background: "linear-gradient(45deg, #047781, #006069)",
          boxShadow: "0 6px 25px rgba(0, 137, 150, 0.6)",
          transform: "translateY(-1px)",
        },
        "&:active": {
          transform: "translateY(0)",
        },
        "&.Mui-disabled": {
          background: "rgba(0, 0, 0, 0.12)",
          color: "rgba(0, 0, 0, 0.26)",
        },
        transition: "all 0.2s ease-in-out",
      }}
    >
      {isLoading ? (
        <Box display="flex" alignItems="center">
          <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
          {loadingText}
        </Box>
      ) : (
        label
      )}
    </Button>
  )
}
