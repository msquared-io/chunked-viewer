import { useState, useMemo } from "react"
import { useEtherstore, useContract } from "@msquared/etherbase-client"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { AnimatedButton } from "../components/ui/animated-button"
import { useTransactionToast } from "@/hooks/useTransactionToast"
import { MarketplaceHeader } from "../components/marketplace/MarketplaceHeader"
import { useSession } from "@/providers/SessionProvider"
import { MarketplaceAddress } from "@/contracts/MarketplaceAddress"
import { MarketplaceAbi } from "@/contracts/MarketplaceAbi"
import { blockTypeNames, blockImages } from "@/constants/blockTypes"
import { InventorySystemAddress } from "@/contracts/InventorySystemAddress"
import { formatNumber } from "@/lib/utils"

// Real inventory item type from the contract
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

interface MarketplaceInventoryItem {
  id: number
  name: string
  quantity: number
  itemId: number
  imageName?: string
}

interface ItemOrderBookState {
  getTopAsksForItem: {
    [itemId: string]: {
      prices: string[]
      qtys: string[]
      orderIds: string[]
    }
  }
  getTopBidsForItem: {
    [itemId: string]: {
      prices: string[]
      qtys: string[]
      orderIds: string[]
    }
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

export default function MarketplaceInventory() {
  const { walletAddress } = useSession()
  const { executeTransaction } = useTransactionToast()
  const [selectedItem, setSelectedItem] = useState<MarketplaceInventoryItem | null>(null)
  const [sellQuantity, setSellQuantity] = useState("1")
  const [sellPrice, setSellPrice] = useState("0.1")

  // Fetch real inventory data
  const { state: inventoryState } = useEtherstore({
    contractAddress: InventorySystemAddress,
    path: ["getInventoryContents", walletAddress ?? ""],
    options: {
      repoll: {
        listenEvents: [
          {
            name: "ItemMoved",
          },
          {
            name: "ItemAdded",
          },
          {
            name: "ItemRemoved",
          },
        ],
      },
    },
  })

  // Fetch market data for the selected item using item-specific functions
  const { state: asksState } = useEtherstore({
    contractAddress: MarketplaceAddress,
    path: ["getTopAsksForItem", selectedItem?.itemId?.toString() ?? "0"],
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
    path: ["getTopBidsForItem", selectedItem?.itemId?.toString() ?? "0"],
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

  const { lowestAsk, highestBid } = useMemo(() => {
    if (!selectedItem) return { lowestAsk: null, highestBid: null }
    
    const asksData = (asksState as unknown as ItemOrderBookState)?.getTopAsksForItem?.[selectedItem.itemId.toString()]
    const bidsData = (bidsState as unknown as ItemOrderBookState)?.getTopBidsForItem?.[selectedItem.itemId.toString()]
    
    console.log("asksData for item", selectedItem.itemId, asksData)
    console.log("bidsData for item", selectedItem.itemId, bidsData)
    
    const asks = asksData?.prices
      ? asksData.prices.map((price, i) => ({
          price: Number(decodeValue(price)) || 0,
          qty: Number(decodeValue(asksData.qtys[i])) || 0,
        })).filter(a => a.price > 0)
      : []

    const bids = bidsData?.prices
      ? bidsData.prices.map((price, i) => ({
          price: Number(decodeValue(price)) || 0,
          qty: Number(decodeValue(bidsData.qtys[i])) || 0,
        })).filter(b => b.price > 0)
      : []

    console.log("asks", asks)
    console.log("bids", bids)

    const lowestAsk = asks.length > 0 ? Math.min(...asks.map(a => a.price)) : null
    const highestBid = bids.length > 0 ? Math.max(...bids.map(b => b.price)) : null

    return { lowestAsk, highestBid }
  }, [asksState, bidsState, selectedItem])
  
  console.log("lowestAsk", lowestAsk)
  console.log("highestBid", highestBid)

  // Process inventory data
  const inventoryItems = useMemo(() => {
    if (!walletAddress || !inventoryState) return []
    
    const rawItems = (inventoryState as unknown as InventoryData)?.getInventoryContents?.[walletAddress]?.items || []
    
    // Group items by itemId and sum quantities
    const groupedItems = new Map<number, { name: string; quantity: number; itemId: number; imageName?: string }>()
    
    for (const item of rawItems) {
      if (typeof item.itemId === "string") {
        item.itemId = Number(decodeValue(item.itemId))
      }
      if (typeof item.amount === "string") {
        item.amount = Number(decodeValue(item.amount))
      }
      if (item.itemId === 0) continue
      const itemName = blockTypeNames[item.itemId] || `item ${item.itemId}`
      const imageName = blockImages[itemName]
      const existing = groupedItems.get(item.itemId)
      
      if (existing) {
        existing.quantity += item.amount
      } else {
        groupedItems.set(item.itemId, {
          name: itemName,
          quantity: item.amount,
          itemId: item.itemId,
          imageName: imageName,
        })
      }
    }
    
    // Convert to array and add sequential IDs for UI
    return Array.from(groupedItems.entries()).map(([itemId, data], index) => ({
      id: index + 1,
      name: data.name,
      quantity: data.quantity,
      itemId: itemId,
      imageName: data.imageName,
    }))
  }, [walletAddress, inventoryState])

  const { execute } = useContract({
    contractAddress: MarketplaceAddress,
    abi: MarketplaceAbi,
  })

  const handleSell = async () => {
    if (!selectedItem || !sellQuantity || !sellPrice) return

    const totalValue = formatNumber(Number(sellQuantity) * Number(sellPrice))
    
    const result = await executeTransaction(
      () => execute({
        methodName: "placeAsk",
        args: {
          itemId: BigInt(selectedItem.itemId),
          qty: BigInt(sellQuantity),
          price: BigInt(Math.floor(Number(sellPrice) * 1e18)),
        },
      }),
      {
        successTitle: 'Item listed for sale!',
        successMessage: `Listed ${sellQuantity} ${selectedItem.name} for ${formatNumber(Number(sellPrice))} STT each (${totalValue} STT total)`,
        errorTitle: 'Failed to list item',
        errorMessage: 'Please try again'
      }
    )

    if (result) {
      // Reset form after successful transaction
      setSellQuantity("1")
      setSellPrice("0.1")
    }
  }

  const isValidSell = selectedItem && 
    sellQuantity && 
    Number(sellQuantity) > 0 && 
    Number(sellQuantity) <= selectedItem.quantity &&
    sellPrice && 
    Number(sellPrice) > 0

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader title="inventory" showBackToMarketplace={true} />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              please log in to view your inventory
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader title="inventory" showBackToMarketplace={true} />
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inventory Grid */}
          <Card>
            <CardHeader>
              <CardTitle>your items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {inventoryItems.length > 0 ? (
                  inventoryItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedItem?.id === item.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedItem(item)}
                      aria-label={`Select ${item.name}`}
                    >
                      <div className="text-center space-y-2">
                        <div className="w-full h-20 bg-muted rounded-md flex items-center justify-center">
                          {item.imageName ? (
                            <img
                              src={`/icons/${item.imageName}.png`}
                              alt={item.name}
                              className="w-12 h-12 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.nextElementSibling?.classList.remove('hidden')
                              }}
                            />
                          ) : null}
                          <span className={`text-muted-foreground text-sm ${item.imageName ? 'hidden' : ''}`}>
                            no image
                          </span>
                        </div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">qty: {item.quantity}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-muted-foreground">
                      {walletAddress ? "no items in inventory" : "loading inventory..."}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sell Panel */}
          <Card>
            <CardHeader>
              <CardTitle>sell item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedItem ? (
                <>
                  {/* Selected Item Info */}
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      {selectedItem.imageName && (
                        <div className="w-8 h-8 bg-background rounded flex items-center justify-center">
                          <img
                            src={`/icons/${selectedItem.imageName}.png`}
                            alt={selectedItem.name}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                      )}
                      <h3 className="font-medium">{selectedItem.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      available: {selectedItem.quantity}
                    </p>
                  </div>

                  {/* Market Data */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">lowest ask</p>
                      <p className="font-medium text-rose-600">
                        {lowestAsk ? `${formatNumber(lowestAsk / 1e18)} STT` : "no asks"}
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">highest bid</p>
                      <p className="font-medium text-emerald-600">
                        {highestBid ? `${formatNumber(highestBid / 1e18)} STT` : "no bids"}
                      </p>
                    </div>
                  </div>

                  {/* Sell Form */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="sell-quantity" className="text-sm font-medium mb-2 block">
                        quantity to sell
                      </label>
                      <Input
                        id="sell-quantity"
                        type="number"
                        placeholder="1"
                        value={sellQuantity}
                        onChange={(e) => setSellQuantity(e.target.value)}
                        min="1"
                        max={selectedItem.quantity}
                      />
                    </div>

                    <div>
                      <label htmlFor="sell-price" className="text-sm font-medium mb-2 block">
                        price per unit (STT)
                      </label>
                      <Input
                        id="sell-price"
                        type="number"
                        placeholder="1"
                        value={sellPrice}
                        onChange={(e) => setSellPrice(e.target.value)}
                        step="0.0001"
                        min="0"
                      />
                    </div>

                    {sellQuantity && sellPrice && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">total value</p>
                        <p className="font-medium">
                          {formatNumber(Number(sellQuantity) * Number(sellPrice))} STT
                        </p>
                      </div>
                    )}

                    <AnimatedButton
                      onClick={handleSell}
                      disabled={!isValidSell}
                      className="w-full"
                      loadingText="listing..."
                      successText="listed!"
                    >
                      sell
                    </AnimatedButton>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    select an item from your inventory to sell
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 