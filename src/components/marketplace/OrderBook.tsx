import { useMemo } from "react"
import { useEtherstore } from "@msquared/etherbase-client"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { MarketplaceAddress } from "@/contracts/MarketplaceAddress"
import { formatNumber } from "@/lib/utils"

interface OrderBookProps {
  /**
   * Underlying ERC-1155 item id the order book is displaying. If omitted the
   * contract is assumed to expose a single global order-book.
   */
  itemId?: number
  /**
   * Number of levels to fetch for the top of book (default 10).
   */
  depth?: number
  /**
   * Callback when an ask is selected
   */
  onAskSelected?: (ask: { price: number; qty: number; orderId: number } | null) => void
  /**
   * Currently selected ask
   */
  selectedAsk?: { price: number; qty: number; orderId: number } | null
  /**
   * Whether to show the title header (default true)
   */
  showTitle?: boolean
}

interface OrderBookState {
  getTopAsks: {
    [key: string]: {
      prices: string[]
      qtys: string[]
    }
  }
  getTopBids: {
    [key: string]: {
      prices: string[]
      qtys: string[]
    }
  }
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
  if (typeof value !== "string") {
    return value
  }
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

export function OrderBook({ itemId, depth = 10, onAskSelected, selectedAsk, showTitle = true }: OrderBookProps) {
  // Use item-specific order book methods if itemId is provided
  const { state: asksState } = useEtherstore({
    contractAddress: MarketplaceAddress,
    path: itemId !== undefined 
      ? ["getTopAsksForItem", itemId.toString()]
      : ["getTopAsks", depth.toString()],
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
    path: itemId !== undefined 
      ? ["getTopBidsForItem", itemId.toString()]
      : ["getTopBids", depth.toString()],
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

  const { asks, bids, maxQty } = useMemo(() => {
    if (itemId !== undefined) {
      // Use item-specific data with Base64 decoding
      const itemAsksState = asksState as unknown as ItemOrderBookState
      const itemBidsState = bidsState as unknown as ItemOrderBookState
      
      const asksData = itemAsksState?.getTopAsksForItem?.[itemId.toString()]
      const bidsData = itemBidsState?.getTopBidsForItem?.[itemId.toString()]

      const asks = asksData?.prices
        ? asksData.prices.map((price, i) => ({
            price: Number(decodeValue(price)) / 1e18, // Convert from wei to STT
            qty: Number(decodeValue(asksData.qtys[i])) || 0,
            orderId: Number(decodeValue(asksData.orderIds[i])) || 0,
          })).filter(a => a.price > 0)
        : []

      const bids = bidsData?.prices
        ? bidsData.prices.map((price, i) => ({
            price: Number(decodeValue(price)) / 1e18, // Convert from wei to STT
            qty: Number(decodeValue(bidsData.qtys[i])) || 0,
            orderId: Number(decodeValue(bidsData.orderIds[i])) || 0,
          })).filter(b => b.price > 0)
        : []

      const maxQty = Math.max(
        ...asks.map((a) => a.qty),
        ...bids.map((b) => b.qty),
        0,
      )

      // Sort asks ascending (cheapest first) & bids descending (highest first)
      asks.sort((a, b) => a.price - b.price)
      bids.sort((a, b) => b.price - a.price)

      return { asks, bids, maxQty }
    }
    
    // Use global data (legacy behavior)
    const globalAsksState = asksState as unknown as OrderBookState
    const globalBidsState = bidsState as unknown as OrderBookState
    
    const asksData = globalAsksState?.getTopAsks?.[depth.toString()]
    const bidsData = globalBidsState?.getTopBids?.[depth.toString()]

    const asks = asksData?.prices
      ? asksData.prices.map((price, i) => ({
          price: Number(price) || 0,
          qty: Number(asksData.qtys[i]) || 0,
          orderId: 0, // Global order book doesn't have order IDs
        }))
      : []

    const bids = bidsData?.prices
      ? bidsData.prices.map((price, i) => ({
          price: Number(price) || 0,
          qty: Number(bidsData.qtys[i]) || 0,
          orderId: 0, // Global order book doesn't have order IDs
        }))
      : []

    const maxQty = Math.max(
      ...asks.map((a) => a.qty),
      ...bids.map((b) => b.qty),
      0,
    )

    // Sort asks ascending (cheapest first) & bids descending (highest first)
    asks.sort((a, b) => a.price - b.price)
    bids.sort((a, b) => b.price - a.price)

    return { asks, bids, maxQty }
  }, [asksState, bidsState, depth, itemId])

  return (
    <Card className="w-full">
      {showTitle && (
        <CardHeader>
          <CardTitle>order book{itemId !== undefined ? ` - item #${itemId}` : ""}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Asks table */}
        <div>
          <p className="text-sm font-medium mb-2 text-rose-600">asks</p>
          {asks.length > 0 ? (
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="py-1">price</th>
                  <th className="py-1">qty</th>
                  <th className="py-1 w-1/2">depth</th>
                </tr>
              </thead>
              <tbody>
                {asks.map((row, index) => {
                  const isSelected = selectedAsk && 
                    selectedAsk.price === row.price && 
                    selectedAsk.qty === row.qty && 
                    selectedAsk.orderId === row.orderId
                  const isClickable = onAskSelected && itemId !== undefined && row.orderId > 0
                  
                  return (
                    <tr
                      key={`ask-${row.price}-${row.qty}-${index}`}
                      className={`
                        ${isClickable ? 'cursor-pointer' : ''} 
                        ${isSelected 
                          ? 'bg-rose-100 dark:bg-rose-900/40 border-rose-300 dark:border-rose-600' 
                          : 'hover:bg-rose-50 dark:hover:bg-rose-900/20'
                        }
                      `}
                      onClick={() => {
                        if (isClickable) {
                          onAskSelected(isSelected ? null : row)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault()
                          onAskSelected(isSelected ? null : row)
                        }
                      }}
                      role={isClickable ? "button" : undefined}
                      tabIndex={isClickable ? 0 : undefined}
                    >
                      <td className="py-0.5 text-rose-600">
                        {itemId !== undefined 
                          ? formatNumber(row.price) 
                          : row.price.toLocaleString()}
                      </td>
                      <td className="py-0.5">{row.qty.toLocaleString()}</td>
                      <td className="py-0.5">
                        <div className="h-2 bg-rose-500/30" style={{ width: `${(row.qty / (maxQty || 1)) * 100}%` }} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              no asks
            </div>
          )}
        </div>
        {/* Bids table */}
        <div className="flex flex-col-reverse">
          <div>
            <p className="text-sm font-medium mb-2 text-emerald-600 text-right">
              bids
            </p>
            {bids.length > 0 ? (
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="py-1">price</th>
                    <th className="py-1">qty</th>
                    <th className="py-1 w-1/2">depth</th>
                  </tr>
                </thead>
                <tbody className="[&_tr]:hover:bg-emerald-50 [&_tr]:dark:hover:bg-emerald-900/20">
                  {bids.map((row, index) => (
                    <tr key={`bid-${row.price}-${row.qty}-${index}`} className="cursor-pointer">
                      <td className="py-0.5 text-emerald-600">
                        {itemId !== undefined 
                          ? formatNumber(row.price) 
                          : row.price.toLocaleString()}
                      </td>
                      <td className="py-0.5">{row.qty.toLocaleString()}</td>
                      <td className="py-0.5">
                        <div className="h-2 bg-emerald-500/30" style={{ width: `${(row.qty / (maxQty || 1)) * 100}%` }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm">
                no bids
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 