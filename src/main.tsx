import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { EtherbaseProvider } from "@msquared/etherbase-client"
import { etherbaseConfig } from "./etherbaseConfig.ts"
import { SessionProvider } from "./providers/SessionProvider.tsx"
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EtherbaseProvider config={etherbaseConfig}>
      <SessionProvider>
        <App />
        <Analytics />
      </SessionProvider>
    </EtherbaseProvider>
  </StrictMode>,
)
