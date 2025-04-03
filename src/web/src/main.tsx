import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import * as Sentry from "@sentry/react"
import { StytchProvider } from "@stytch/react"
import { StytchUIClient } from "@stytch/vanilla-js"
import { t } from "i18next"
import App from "./App.tsx"
import "./i18n"
import "./index.css"

const stytch = new StytchUIClient("public-token-test-37e5d883-b15b-45cc-8615-a355d9bc27af")

Sentry.init({
  dsn: "https://047c1dd7c269fc28cd01d8a19cb90843@o4509044461600768.ingest.de.sentry.io/4509044468613200",
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
        <App />
      </ThemeProvider>
    </StytchProvider>
  </StrictMode>,
)
