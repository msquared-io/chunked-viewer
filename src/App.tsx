import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import WalletPage from "./pages/WalletPage"
import MarketplaceHome from "./pages/MarketplaceHome"
import MarketplaceItemPage from "./pages/MarketplaceItemPage"
import MarketplaceInventory from "./pages/MarketplaceInventory"
import "./index.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users/:walletAddress" element={<WalletPage />} />
        <Route path="/marketplace" element={<MarketplaceHome />} />
        <Route path="/marketplace/inventory" element={<MarketplaceInventory />} />
        <Route path="/marketplace/:itemId" element={<MarketplaceItemPage />} />
        {/* Redirect old route pattern for backward compatibility */}
        <Route path="/:walletAddress" element={<WalletPage />} />
      </Routes>
    </Router>
  )
}

export default App
  