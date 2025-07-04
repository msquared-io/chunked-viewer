import { useState, useMemo, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { useContract, useEtherstore, useSession } from "@msquared/etherbase-client"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { AnimatedButton } from "../components/ui/animated-button"
import { Input } from "../components/ui/input"
import { useTransactionToast } from "@/hooks/useTransactionToast"
import { OrderBook } from "../components/marketplace/OrderBook"
import { MarketplaceHeader } from "../components/marketplace/MarketplaceHeader"
import { Particles } from "../components/magicui/particles"
import { useSession as useSessionProvider } from "@/providers/SessionProvider"
import { MarketplaceAddress } from "@/contracts/MarketplaceAddress"
import { MarketplaceAbi } from "@/contracts/MarketplaceAbi"
import { InventorySystemAddress } from "@/contracts/InventorySystemAddress"
import { blockTypeNames, blockImages } from "@/constants/blockTypes"
import { formatNumber } from "@/lib/utils"

// Helper function to decode values
function decodeValue(value: string) {
  if (typeof value !== "string") {
    return value
  }
  const valueString = atob(value)
  const valueBytes = new Uint8Array(valueString.length)
  for (let j = 0; j < valueString.length; j++) {
    valueBytes[j] = valueString.charCodeAt(j)
  }
  
  let result = 0n;
  for (const byte of valueBytes) {
    result = (result << 8n) | BigInt(byte);
  }
  return result
}

interface InventoryItem {
  slot: number
  itemId: number
  amount: number
  name: string
  durability: number
}

interface InventoryData {
  getInventoryContents: {
    [address: string]: {
      items: InventoryItem[]
    }
  }
}

export default function MarketplaceItemPage() {
  const { itemId } = useParams<{ itemId: string }>()
  const numericItemId = Number(itemId)
  const { walletAddress } = useSessionProvider()
  const { executeTransaction } = useTransactionToast()
  
  // State for ask selection and buying
  const [selectedAsk, setSelectedAsk] = useState<{ price: number; qty: number; orderId: number } | null>(null)
  const [buyQuantity, setBuyQuantity] = useState("1")
  
  // State for bidding
  const [bidQuantity, setBidQuantity] = useState("1")
  const [bidPrice, setBidPrice] = useState("0.001")

  // Session balance state
  const [sessionBalance, setSessionBalance] = useState<bigint | null>(null)
  const [, setIsLoadingBalance] = useState(false)

  // Use the etherbase session hook
  const { 
    getSessionBalance,
  } = useSession()

  // Load session balance
  const loadSessionBalance = useCallback(async () => {
    if (!walletAddress) return
    
    setIsLoadingBalance(true)
    try {
      const balance = await getSessionBalance()
      setSessionBalance(balance)
    } catch (error) {
      console.error("Failed to load session balance:", error)
    } finally {
      setIsLoadingBalance(false)
    }
  }, [walletAddress, getSessionBalance])

  // Load session balance on mount and when wallet changes
  useEffect(() => {
    if (walletAddress) {
      loadSessionBalance()
    }
  }, [walletAddress, loadSessionBalance])

  // Fetch user's inventory to get item balance
  const { state: inventoryState } = useEtherstore({
    contractAddress: InventorySystemAddress,
    path: ["getInventoryContents", walletAddress ?? ""],
    options: {
      repoll: {
        listenEvents: [
          {
            name: "ItemMoved",
            args: {
              player: walletAddress ? [walletAddress] : [],
            }
          },
          {
            name: "ItemAdded",
            args: {
              player: walletAddress ? [walletAddress] : [],
            }
          },
          {
            name: "ItemRemoved",
            args: {
              player: walletAddress ? [walletAddress] : [],
            }
          },
        ],
      },
    },
  })

  // Calculate user's balance of this specific item
  const userItemBalance = useMemo(() => {
    if (!walletAddress || !inventoryState) return 0
    
    const rawItems = (inventoryState as unknown as InventoryData)?.getInventoryContents?.[walletAddress]?.items || []
    
    let totalBalance = 0
    for (const item of rawItems) {
      let itemId = item.itemId
      let amount = item.amount
      
      if (typeof itemId === "string") {
        itemId = Number(decodeValue(itemId))
      }
      if (typeof amount === "string") {
        amount = Number(decodeValue(amount))
      }
      
      if (itemId === numericItemId) {
        totalBalance += amount
      }
    }
    
    return totalBalance
  }, [walletAddress, inventoryState, numericItemId])

  const { execute } = useContract({
    contractAddress: MarketplaceAddress,
    abi: MarketplaceAbi,
  })

  const itemName = blockTypeNames[numericItemId] || `item ${numericItemId}`
  const itemImageName = blockImages[itemName]

  const handleBuyAsk = async () => {
    if (!selectedAsk || !buyQuantity || !walletAddress) return

    const value = BigInt(Math.floor(Number(selectedAsk.price) * Number(buyQuantity) * 1e18))
    console.log("value", value)
    const totalCost = formatNumber(Number(selectedAsk.price) * Number(buyQuantity))
    
    const result = await executeTransaction(
      () => execute({
        methodName: "buyExact",
        args: {
          askId: selectedAsk.orderId,
          qty: BigInt(buyQuantity),
        },
        value,
      }),
      {
        successTitle: 'Purchase successful!',
        successMessage: `Bought ${buyQuantity} ${itemName} for ${totalCost} STT`,
        errorTitle: 'Purchase failed',
        errorMessage: 'Please check your balance and try again'
      }
    )

    if (result) {
      // Reset selection after successful purchase
      setSelectedAsk(null)
      setBuyQuantity("1")
      // Refresh balance after purchase
      loadSessionBalance()
    }
  }

  const handlePlaceBid = async () => {
    if (!bidQuantity || !bidPrice || !walletAddress) return

    const price = BigInt(Math.floor(Number(bidPrice) * 1e18))
    const value = price * BigInt(bidQuantity)
    const totalValue = formatNumber(Number(bidPrice) * Number(bidQuantity))

    const result = await executeTransaction(
      () => execute({
        methodName: "placeBid",
        value,
        args: {
          itemId: BigInt(numericItemId),
          qty: BigInt(bidQuantity),
          price,
        },
      }),
      {
        successTitle: 'Bid placed successfully!',
        successMessage: `Placed bid for ${bidQuantity} ${itemName} at ${formatNumber(Number(bidPrice))} STT each (${totalValue} STT total)`,
        errorTitle: 'Bid failed',
        errorMessage: 'Please check your balance and try again'
      }
    )

    if (result) {
      // Reset form after successful bid
      setBidQuantity("1")
      setBidPrice("0.001")
      // Refresh balance after bid
      loadSessionBalance()
    }
  }

  // Check if user has sufficient balance for transactions
  const hasZeroBalance = sessionBalance !== null && sessionBalance === 0n
  const hasSufficientBalanceForBuy = selectedAsk && sessionBalance !== null && 
    sessionBalance >= BigInt(Math.floor(Number(selectedAsk.price) * Number(buyQuantity) * 1e18))
  const hasSufficientBalanceForBid = bidQuantity && bidPrice && sessionBalance !== null &&
    sessionBalance >= BigInt(Math.floor(Number(bidPrice) * Number(bidQuantity) * 1e18))

  const isValidBuy = selectedAsk && 
    buyQuantity && 
    Number(buyQuantity) > 0 && 
    Number(buyQuantity) <= selectedAsk.qty &&
    walletAddress &&
    hasSufficientBalanceForBuy

  const isValidBid = bidQuantity && 
    Number(bidQuantity) > 0 && 
    bidPrice && 
    Number(bidPrice) > 0 &&
    walletAddress &&
    hasSufficientBalanceForBid

  return (
    <div className="min-h-screen bg-background relative">
      {/* Particles Background */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={120}
        ease={80}
        color="#3b82f6"
        refresh={false}
      />
      
      {/* Header */}
      <div className="relative z-10">
        <MarketplaceHeader 
          title="chunked marketplace" 
          showBackToMarketplace={true} 
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="space-y-8">
          {/* Top Section: Item Info (Left) and Order Book (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Item Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    {/* Item Name */}
                    <h1 className="text-2xl font-bold">{itemName}</h1>
                    <p className="text-sm text-muted-foreground">#{numericItemId}</p>
                    
                    {/* Item Icon */}
                    <div className="w-24 h-24 mx-auto bg-muted rounded-lg flex items-center justify-center">
                      {itemImageName ? (
                        <img
                          src={`/icons/${itemImageName}.png`}
                          alt={itemName}
                          className="w-20 h-20 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : null}
                      <span className={`text-muted-foreground ${itemImageName ? 'hidden' : ''}`}>
                        no image
                      </span>
                    </div>

                    {/* User's Balance */}
                    {walletAddress && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-center">
                          <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">
                            your have
                          </p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {userItemBalance}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side: Order Book */}
            <div className="lg:col-span-2">
              {/* Custom OrderBook without title */}
              <OrderBook 
                itemId={numericItemId} 
                onAskSelected={setSelectedAsk}
                selectedAsk={selectedAsk}
                showTitle={false}
              />
            </div>
          </div>

          {/* Bottom Section: Trading Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Buy Section */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                  buy now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!walletAddress ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-6 h-6 border-2 border-emerald-600 rounded border-dashed" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      connect your wallet to buy items
                    </p>
                    <Button
                      disabled
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      size="lg"
                    >
                      connect wallet to buy
                    </Button>
                  </div>
                ) : hasZeroBalance ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-6 h-6 text-orange-600">💰</div>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      no balance available
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      deposit funds to start trading
                    </p>
                    <Button
                      disabled
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      size="lg"
                    >
                      deposit funds to buy
                    </Button>
                  </div>
                ) : selectedAsk ? (
                  <>
                    {/* Selected Ask Display */}
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                          selected order
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedAsk(null)}
                          className="text-emerald-600 hover:text-emerald-800 text-sm"
                        >
                          clear
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">price</p>
                          <p className="font-semibold">{formatNumber(selectedAsk.price)} STT</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">available</p>
                          <p className="font-semibold">{selectedAsk.qty}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">order #</p>
                          <p className="font-semibold">{selectedAsk.orderId}</p>
                        </div>
                      </div>
                    </div>

                    {/* Session Balance Display */}
                    {sessionBalance !== null && (
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-purple-700 dark:text-purple-300">session balance</span>
                          <span className="font-semibold text-purple-900 dark:text-purple-100">
                            {formatNumber(Number(sessionBalance) / 1e18)} STT
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Buy Form */}
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="buy-quantity" className="text-sm font-medium mb-2 block">
                          quantity
                        </label>
                        <Input
                          id="buy-quantity"
                          type="number"
                          placeholder="1"
                          value={buyQuantity}
                          onChange={(e) => setBuyQuantity(e.target.value)}
                          min="1"
                          max={selectedAsk.qty}
                          className="text-center"
                        />
                      </div>

                      {buyQuantity && Number(buyQuantity) > 0 && (
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">total cost</span>
                            <span className="font-semibold">
                              {formatNumber(selectedAsk.price * Number(buyQuantity))} STT
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Insufficient balance warning */}
                      {selectedAsk && buyQuantity && !hasSufficientBalanceForBuy && sessionBalance !== null && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Insufficient balance. Need {formatNumber(selectedAsk.price * Number(buyQuantity))} STT
                          </p>
                        </div>
                      )}

                      <AnimatedButton
                        onClick={handleBuyAsk}
                        disabled={!isValidBuy}
                        className={`w-full ${!hasSufficientBalanceForBuy && sessionBalance !== null ? 'bg-orange-600 hover:bg-orange-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                        size="lg"
                        loadingText="buying..."
                        successText="purchased!"
                      >
                        {!hasSufficientBalanceForBuy && sessionBalance !== null 
                          ? "deposit more funds to buy" 
                          : `buy ${buyQuantity} ${itemName}`}
                      </AnimatedButton>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-6 h-6 border-2 border-emerald-600 rounded border-dashed" />
                    </div>
                    <p className="text-muted-foreground mb-2">
                      select an ask from the order book
                    </p>
                    <p className="text-sm text-muted-foreground">
                      click on any ask price to buy instantly
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bid Section */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  place bid
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!walletAddress ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-6 h-6 border-2 border-blue-600 rounded-full border-dashed" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      connect your wallet to place bids
                    </p>
                    <Button
                      disabled
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      connect wallet to bid
                    </Button>
                  </div>
                ) : hasZeroBalance ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-6 h-6 text-orange-600">💰</div>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      no balance available
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      deposit funds to start trading
                    </p>
                    <Button
                      disabled
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      size="lg"
                    >
                      deposit funds to bid
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Session Balance Display */}
                    {sessionBalance !== null && (
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-purple-700 dark:text-purple-300">session balance</span>
                          <span className="font-semibold text-purple-900 dark:text-purple-100">
                            {formatNumber(Number(sessionBalance) / 1e18)} STT
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="bid-quantity" className="text-sm font-medium mb-2 block">
                          quantity
                        </label>
                        <Input
                          id="bid-quantity"
                          type="number"
                          placeholder="1"
                          value={bidQuantity}
                          onChange={(e) => setBidQuantity(e.target.value)}
                          min="1"
                          className="text-center"
                        />
                      </div>

                      <div>
                        <label htmlFor="bid-price" className="text-sm font-medium mb-2 block">
                          max price
                        </label>
                        <Input
                          id="bid-price"
                          type="number"
                          placeholder="0.001"
                          value={bidPrice}
                          onChange={(e) => setBidPrice(e.target.value)}
                          step="0.0001"
                          min="0"
                          className="text-center"
                        />
                      </div>
                    </div>

                    {bidQuantity && bidPrice && Number(bidQuantity) > 0 && Number(bidPrice) > 0 && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700 dark:text-blue-300">total bid value</span>
                          <span className="font-semibold text-blue-900 dark:text-blue-100">
                            {formatNumber(Number(bidQuantity) * Number(bidPrice))} STT
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Insufficient balance warning */}
                    {bidQuantity && bidPrice && !hasSufficientBalanceForBid && sessionBalance !== null && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Insufficient balance. Need {formatNumber(Number(bidQuantity) * Number(bidPrice))} STT
                        </p>
                      </div>
                    )}

                    <AnimatedButton
                      onClick={handlePlaceBid}
                      disabled={!isValidBid}
                      className={`w-full ${!hasSufficientBalanceForBid && sessionBalance !== null ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                      size="lg"
                      loadingText="placing bid..."
                      successText="bid placed!"
                    >
                      {!hasSufficientBalanceForBid && sessionBalance !== null 
                        ? "deposit more funds to bid" 
                        : "place bid"}
                    </AnimatedButton>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 