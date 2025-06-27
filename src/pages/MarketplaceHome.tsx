import { useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useEtherstore } from "@msquared/etherbase-client"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { MarketplaceHeader } from "../components/marketplace/MarketplaceHeader"
import { useSession } from "@/providers/SessionProvider"
import { MarketplaceAddress } from "@/contracts/MarketplaceAddress"
import { UserStatsSystemAddress } from "@/contracts/UserStatsSystemAddress"
import { blockTypeNames, blockImages } from "@/constants/blockTypes"
import { formatNumber } from "@/lib/utils"

interface MarketplaceItem {
  id: number
  name: string
  itemId: number
  image?: string
  tradeCount: number
  sellCount: number
  totalActivity: number
  sellStatus: string
}

interface MarketplaceOrder {
  price: number
  qty: number
  itemId: number
  itemName: string
  imageName?: string
}

interface OrderBookState {
  getTopAsks: {
    prices: string[]
    qtys: string[]
    itemIds: string[]
  }
  getTopBids: {
    prices: string[]
    qtys: string[]
    itemIds: string[]
  }
}

interface GlobalTradeStatsState {
  getGlobalTradeStats: {
    totalTrades: string
    tradedItems: Array<{
      itemType: string
      count: string
    }>
    itemTypes: string[]
    tradeCounts: string[]
  }
}

interface GlobalSellStatsState {
  getGlobalSellStats: {
    totalSellOrders: string
    sellOrderItems: Array<{
      itemType: string
      count: string
    }>
    itemTypes: string[]
    sellCounts: string[]
  }
}

function decodeValue(value: string) {
  // Decode Base64 to bytes using browser-compatible method
  const valueString = atob(value)
  const valueBytes = new Uint8Array(valueString.length)
  for (let j = 0; j < valueString.length; j++) {
    valueBytes[j] = valueString.charCodeAt(j)
  }
  
  // Convert bytes to BigInt
  let result = 0n;
  for (const byte of valueBytes) {
    result = (result << 8n) | BigInt(byte);
  }
  return result
}

export default function MarketplaceHome() {
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const { walletAddress, login } = useSession()

  // Fetch global trade stats to sort items by actual sales
  const { state: globalTradeStatsState } = useEtherstore({
    contractAddress: UserStatsSystemAddress,
    path: ["getGlobalTradeStats"],
    options: {
      repoll: {
        listenEvents: [
          { name: "TradeRecorded" },
        ],
      },
    },
  })

  // Fetch global sell stats to get items up for sale
  const { state: globalSellStatsState } = useEtherstore({
    contractAddress: UserStatsSystemAddress,
    path: ["getGlobalSellStats"],
    options: {
      repoll: {
        listenEvents: [
          { name: "SellOrderPlaced" },
        ],
      },
    },
  })

  // Fetch top asks and bids from the marketplace
  const { state: asksState } = useEtherstore({
    contractAddress: MarketplaceAddress,
    path: ["getTopAsks"],
    options: {
      repoll: {
        listenEvents: [
          { name: "AskPlaced" },
          { name: "BidPlaced" },
          { name: "Trade" },
          { name: "OrderCancelled" },
        ],
      },
    },
  })

  const { state: bidsState } = useEtherstore({
    contractAddress: MarketplaceAddress,
    path: ["getTopBids"],
    options: {
      repoll: {
        listenEvents: [
          { name: "AskPlaced" },
          { name: "BidPlaced" },
          { name: "Trade" },
          { name: "OrderCancelled" },
        ],
      },
    },
  })

  // Process global trade stats and sell stats to create sorted item list
  const gameItems = useMemo(() => {
    const tradeStatsData = (globalTradeStatsState as unknown as GlobalTradeStatsState)?.getGlobalTradeStats
    const sellStatsData = (globalSellStatsState as unknown as GlobalSellStatsState)?.getGlobalSellStats
    
    // Create a map of itemId to trade count
    const tradeCountMap = new Map<number, number>()
    if (tradeStatsData?.itemTypes && tradeStatsData?.tradeCounts) {
      tradeStatsData.itemTypes.forEach((itemType: string, index: number) => {
        const itemId = Number(decodeValue(itemType))
        const tradeCount = Number(decodeValue(tradeStatsData.tradeCounts[index]))
        tradeCountMap.set(itemId, tradeCount)
      })
    }

    // Create a map of itemId to sell count (up for sale)
    const sellCountMap = new Map<number, number>()
    if (sellStatsData?.itemTypes && sellStatsData?.sellCounts) {
      sellStatsData.itemTypes.forEach((itemType: string, index: number) => {
        const itemId = Number(decodeValue(itemType))
        const sellCount = Number(decodeValue(sellStatsData.sellCounts[index]))
        sellCountMap.set(itemId, sellCount)
      })
    }

    // Convert blockTypeNames to items array with both trade and sell stats
    const items: MarketplaceItem[] = Object.entries(blockTypeNames).map(([itemIdStr, name]) => {
      const itemId = Number(itemIdStr)
      const tradeCount = tradeCountMap.get(itemId) || 0
      const sellCount = sellCountMap.get(itemId) || 0
      const totalActivity = tradeCount + sellCount
      const imageName = blockImages[name]
      
      const sellStatus = tradeCount > 0 || sellCount > 0 
        ? `${tradeCount} traded, ${sellCount} sold`
        : "Not sold yet"
      
      return {
        id: itemId, // Use actual itemId as the ID
        name,
        itemId,
        image: imageName,
        tradeCount,
        sellCount,
        totalActivity,
        sellStatus
      }
    })

    // Sort by total activity (descending), then by name
    items.sort((a, b) => {
      if (a.totalActivity !== b.totalActivity) {
        return b.totalActivity - a.totalActivity
      }
      return a.name.localeCompare(b.name)
    })

    return items
  }, [globalTradeStatsState, globalSellStatsState])

  const { topAsks, topBids } = useMemo(() => {
    const asksData = (asksState as unknown as OrderBookState)?.getTopAsks
    const bidsData = (bidsState as unknown as OrderBookState)?.getTopBids

    const topAsks: MarketplaceOrder[] = asksData?.prices
      ? asksData.prices.map((price, i) => {
          const itemId = Number(decodeValue(asksData.itemIds[i])) || 0
          const itemName = blockTypeNames[itemId] || `item ${itemId}`
          const imageName = blockImages[itemName]
          return {
            price: Number(decodeValue(price)) || 0,
            qty: Number(decodeValue(asksData.qtys[i])) || 0,
            itemId,
            itemName,
            imageName,
          }
        }).filter(ask => ask.price > 0).slice(0, 10)
      : []

    const topBids: MarketplaceOrder[] = bidsData?.prices
      ? bidsData.prices.map((price, i) => {
          const itemId = Number(decodeValue(bidsData.itemIds[i])) || 0
          const itemName = blockTypeNames[itemId] || `item ${itemId}`
          const imageName = blockImages[itemName]
          return {
            price: Number(decodeValue(price)) || 0,
            qty: Number(decodeValue(bidsData.qtys[i])) || 0,
            itemId,
            itemName,
            imageName,
          }
        }).filter(bid => bid.price > 0).slice(0, 10)
      : []

    return { topAsks, topBids }
  }, [asksState, bidsState])

  const filtered = gameItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const firstMatch = filtered[0]
    if (firstMatch) {
      navigate(`/marketplace/${firstMatch.id}`)
    }
  }

  const handleMarketItemClick = (itemId: number) => {
    navigate(`/marketplace/${itemId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Header */}
      <MarketplaceHeader />

      {/* Top 50% - Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-8">
          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Chunked Marketplace
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl">
              Trade blocks, build wealth, dominate the market
            </p>
          </div>

          {/* Action Cards */}
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
            {walletAddress ? (
              <>
                {/* My Inventory Card */}
                <Link to="/marketplace/inventory" className="flex-1">
                  <Card className="h-full bg-gradient-to-br from-emerald-500 to-teal-600 border-0 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-8 text-center">
                                             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                         <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" aria-label="Inventory icon">
                           <title>Inventory icon</title>
                           <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                           <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                         </svg>
                       </div>
                      <h3 className="text-2xl font-bold mb-2">My Inventory</h3>
                      <p className="text-emerald-100">View your items and start selling</p>
                    </CardContent>
                  </Card>
                </Link>

                {/* Browse Market Card */}
                <Card className="flex-1 bg-gradient-to-br from-blue-500 to-indigo-600 border-0 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                                         <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                       <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" aria-label="Market browse icon">
                         <title>Market browse icon</title>
                         <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                       </svg>
                     </div>
                    <h3 className="text-2xl font-bold mb-2">Browse Market</h3>
                    <p className="text-blue-100">Explore items and live trading data</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Login Card */
              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 border-0 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 max-w-md mx-auto">
                <CardContent className="p-8 text-center">
                                     <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                     <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" aria-label="User profile icon">
                       <title>User profile icon</title>
                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                     </svg>
                   </div>
                  <h3 className="text-3xl font-bold mb-4">Ready to Trade?</h3>
                  <p className="text-purple-100 mb-6 text-lg">Connect your wallet to start buying and selling blocks</p>
                  <Button onClick={login} size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3">
                    Connect Wallet
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Check out the live market and items to trade below
          </p>
        </div>
      </div>

      {/* Bottom 50% - Market Data */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Live Market Data */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Market Data</h2>
              </div>
              
              {/* Top Asks & Bids */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Top Asks */}
                <Card className="border-rose-200 dark:border-rose-800 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-rose-600 text-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-600 rounded-full" />
                      Top Asks (For Sale)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-80 overflow-y-auto">
                      {topAsks.length > 0 ? (
                        topAsks.slice(0, 10).map((ask, index) => (
                          <button
                            key={`ask-${ask.itemId}-${ask.price}-${index}`}
                            type="button"
                            className="flex items-center gap-2 p-3 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors border-b last:border-b-0 cursor-pointer w-full text-left"
                            onClick={() => handleMarketItemClick(ask.itemId)}
                          >
                            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center flex-shrink-0">
                              {ask.imageName ? (
                                <img
                                  src={`/icons/${ask.imageName}.png`}
                                  alt={ask.itemName}
                                  className="w-6 h-6 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                  }}
                                />
                              ) : null}
                              <span className={`text-muted-foreground text-xs ${ask.imageName ? 'hidden' : ''}`}>
                                ?
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{ask.itemName}</p>
                              <p className="text-xs text-muted-foreground">Qty: {ask.qty}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-rose-600 text-sm">
                                {formatNumber(ask.price / 1e18)}
                              </p>
                              <p className="text-xs text-muted-foreground">STT</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground text-sm">No active sell orders</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Bids */}
                <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-emerald-600 text-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                      Top Bids (Wanted)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-80 overflow-y-auto">
                      {topBids.length > 0 ? (
                        topBids.slice(0, 10).map((bid, index) => (
                          <button
                            key={`bid-${bid.itemId}-${bid.price}-${index}`}
                            type="button"
                            className="flex items-center gap-2 p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border-b last:border-b-0 cursor-pointer w-full text-left"
                            onClick={() => handleMarketItemClick(bid.itemId)}
                          >
                            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center flex-shrink-0">
                              {bid.imageName ? (
                                <img
                                  src={`/icons/${bid.imageName}.png`}
                                  alt={bid.itemName}
                                  className="w-6 h-6 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                  }}
                                />
                              ) : null}
                              <span className={`text-muted-foreground text-xs ${bid.imageName ? 'hidden' : ''}`}>
                                ?
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{bid.itemName}</p>
                              <p className="text-xs text-muted-foreground">Qty: {bid.qty}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-emerald-600 text-sm">
                                {formatNumber(bid.price / 1e18)}
                              </p>
                              <p className="text-xs text-muted-foreground">STT</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground text-sm">No active buy orders</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Side - Browse Items */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Browse All Items</h2>
                
                {/* Search */}
                <Card className="mb-4 shadow-lg">
                  <CardContent className="p-4">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                      <Input
                        placeholder="Search blocks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!filtered.length} size="sm" className="shadow-sm">
                        Go
                      </Button>
                    </form>
                    <p className="text-xs text-muted-foreground mt-2">
                      {filtered.length} items found
                    </p>
                  </CardContent>
                </Card>

                {/* Items Grid */}
                                <div className="max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 pr-2">
                    {filtered.slice(0, 24).map((item) => (
                      <Link key={item.id} to={`/marketplace/${item.id}`}>
                        <Card className="hover:shadow-lg transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-800 group hover:scale-105">
                          <CardContent className="p-3">
                            <div className="flex flex-col items-center space-y-2">
                              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                {item.image ? (
                                  <img
                                    src={`/icons/${item.image}.png`}
                                    alt={item.name}
                                    className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                    }}
                                  />
                                ) : null}
                                <span className={`text-muted-foreground text-xs ${item.image ? 'hidden' : ''}`}>
                                  ?
                                </span>
                              </div>
                              <div className="text-center">
                                <p className="text-xs font-medium truncate w-full group-hover:text-blue-600 transition-colors">
                                  {item.name}
                                </p>
                                <p className={`text-xs ${
                                  item.totalActivity > 0 
                                    ? 'text-emerald-600 font-medium' 
                                    : 'text-muted-foreground'
                                }`}>
                                  {item.totalActivity > 0 ? `${item.totalActivity} trades` : 'New'}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {filtered.length > 24 && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing first 24 items. Use search to find specific blocks.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 