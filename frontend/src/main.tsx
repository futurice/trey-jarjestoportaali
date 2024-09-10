import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { StytchProvider } from "@stytch/react"
import { StytchUIClient } from "@stytch/vanilla-js"
import { Theme } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"
import App from "./App.tsx"
import "./index.css"

const stytch = new StytchUIClient("public-token-test-37e5d883-b15b-45cc-8615-a355d9bc27af")

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StytchProvider stytch={stytch}>
      <Theme accentColor="blue" hasBackground={false} panelBackground="solid">
        <App />
      </Theme>
    </StytchProvider>
  </StrictMode>,
)
