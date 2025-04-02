import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import WalletPage from "./pages/WalletPage"
import "./index.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users/:walletAddress" element={<WalletPage />} />
        {/* Redirect old route pattern for backward compatibility */}
        <Route path="/:walletAddress" element={<WalletPage />} />
      </Routes>
    </Router>
  )
}

export default App
