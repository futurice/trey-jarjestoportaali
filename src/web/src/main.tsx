import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Toaster } from "react-hot-toast"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import * as Sentry from "@sentry/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { t } from "i18next"
import App from "./App.tsx"
import { AuthProvider } from "./authentication/AuthContext.tsx"
import config from "./config/index.ts"
import "./i18n"
import "./index.css"

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

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
