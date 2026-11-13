import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { connectAgent } from "./agent"
import { App } from "./App"
import "./index.css"

connectAgent()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
