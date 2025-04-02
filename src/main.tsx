import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { EtherbaseProvider } from "@msquared/etherbase-client"
import { etherbaseConfig } from "./etherbaseConfig.ts"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EtherbaseProvider config={etherbaseConfig}>
      <App />
    </EtherbaseProvider>
  </StrictMode>,
)
