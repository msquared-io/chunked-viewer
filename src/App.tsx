import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import HomePage from "./pages/HomePage"
import WalletPage from "./pages/WalletPage"
import MarketplaceHome from "./pages/MarketplaceHome"
import MarketplaceItemPage from "./pages/MarketplaceItemPage"
import MarketplaceInventory from "./pages/MarketplaceInventory"
import { ToastProvider } from "./components/ui/toast"
import "./index.css"

function App() {
  const [isMarketplaceDomain, setIsMarketplaceDomain] = useState(false)

  useEffect(() => {
    // Check if we're on the marketplace subdomain
    const isMarketplace = window.location.hostname === 'marketplace.chunked.xyz' || 
                         window.location.search.includes('marketplace=true')
    setIsMarketplaceDomain(isMarketplace)
  }, [])

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              isMarketplaceDomain ? 
                <Navigate to="/marketplace" replace /> : 
                <HomePage />
            } 
          />
          <Route path="/users/:walletAddress" element={<WalletPage />} />
          <Route path="/marketplace" element={<MarketplaceHome />} />
          <Route path="/marketplace/inventory" element={<MarketplaceInventory />} />
          <Route path="/marketplace/:itemId" element={<MarketplaceItemPage />} />
          {/* Redirect old route pattern for backward compatibility */}
          <Route path="/:walletAddress" element={<WalletPage />} />
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
  