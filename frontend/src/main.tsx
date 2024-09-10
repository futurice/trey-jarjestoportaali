import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import { Theme } from "@radix-ui/themes"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme accentColor="blue" hasBackground={false} panelBackground="solid">
      <App />
    </Theme>
  </StrictMode>
)
