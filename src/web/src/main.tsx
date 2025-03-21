import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import { StytchProvider } from "@stytch/react"
import { StytchUIClient } from "@stytch/vanilla-js"
import App from "./App.tsx"
import "./index.css"

const stytch = new StytchUIClient("public-token-test-37e5d883-b15b-45cc-8615-a355d9bc27af")

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: "#006069",
    },
    secondary: {
      main: "#ffcc00",
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CssBaseline />
    <StytchProvider stytch={stytch}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StytchProvider>
  </StrictMode>,
)
