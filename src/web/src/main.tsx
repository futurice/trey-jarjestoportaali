import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import * as Sentry from "@sentry/react"
import { StytchProvider } from "@stytch/react"
import { StytchUIClient } from "@stytch/vanilla-js"
import { t } from "i18next"
import App from "./App.tsx"
import config from "./config/index.ts"
import "./i18n"
import "./index.css"
import { Toaster } from "react-hot-toast"

const stytch = new StytchUIClient(config.stytch.publicToken)

Sentry.init({
  dsn: config.sentry.dsn,
  integrations: [
    Sentry.feedbackAsyncIntegration({
      showBranding: false,
      colorScheme: "system",
      triggerLabel: t("feedback.trigger"),
      cancelButtonLabel: t("feedback.cancel"),
      confirmButtonLabel: t("feedback.confirm"),
      addScreenshotButtonLabel: t("feedback.addScreenshot"),
      removeScreenshotButtonLabel: t("feedback.removeScreenshot"),
      nameLabel: t("feedback.name"),
      namePlaceholder: t("feedback.namePlaceholder"),
      emailLabel: t("feedback.email"),
      emailPlaceholder: t("feedback.emailPlaceholder"),
      isRequiredLabel: t("feedback.isRequired"),
      messageLabel: t("feedback.message"),
      messagePlaceholder: t("feedback.messagePlaceholder"),
      successMessageText: t("feedback.successMessage"),
      buttonLabel: t("feedback.label"),
      submitButtonLabel: t("feedback.submit"),
      formTitle: t("feedback.title"),
    }),
  ],
})

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
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            error: {
              duration: 10000,
              removeDelay: 2000,
            },
            success: {
              duration: 3000,
            },
          }}
          containerStyle={{
            textAlign: "left",
          }}
        />
        <App />
      </ThemeProvider>
    </StytchProvider>
  </StrictMode>,
)
