import { useParams, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { useEtherstore } from "@msquared/etherbase-client"
import type { UserStats, UserInventoryStats } from "../types/stats"
import { StatsOverview } from "../components/stats/StatsOverview"
import { BlockStats } from "../components/stats/BlockStats"
import { InventoryStats } from "../components/stats/InventoryStats"
import { blockTypeNames } from "../constants/blockTypes"

// Inventory types
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

export default function WalletPage() {
  const { walletAddress } = useParams<{ walletAddress: string }>()

  const { state: userStatsState } = useEtherstore({
    contractAddress: "0x802489124802e335123997AEB06605B06bD6A12f",
    path: ["getUserStats", walletAddress ?? ""],
    options: {
      repoll: {
        listenEvents: [
          {
            name: "PlayerUpdated",
          },
        ],
      },
    },
  })

  const { state: userInventoryStatsState } = useEtherstore({
    contractAddress: "0x802489124802e335123997AEB06605B06bD6A12f",
    path: ["getUserInventoryStats", walletAddress ?? ""],
    options: {
      repoll: {
        listenEvents: [
          {
            name: "PlayerUpdated",
          },
        ],
      },
    },
  })

  const { state: inventoryState } = useEtherstore({
    contractAddress: "0xee10C818b65727b7BE02B66a15B57CbeCA760478",
    path: ["getInventoryContents", walletAddress ?? ""],
    options: {
      repoll: {
        listenEvents: [
          {
            name: "PlayerUpdated",
          },
        ],
      },
    },
  })

  console.log("userStatsState", userStatsState)

  // Extract user data from state
  const userData =
    walletAddress &&
    (
      userStatsState as unknown as {
        getUserStats: { [key: string]: UserStats }
      }
    )?.getUserStats?.[walletAddress]

  const userInventoryData =
    walletAddress &&
    (
      userInventoryStatsState as unknown as {
        getUserInventoryStats: { [key: string]: UserInventoryStats }
      }
    )?.getUserInventoryStats?.[walletAddress]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <a
                href="https://chunked.xyz"
                className="hover:text-primary transition-colors"
              >
                chunked stats
              </a>
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground">
                viewing details for wallet:{" "}
                <span className="font-mono">{walletAddress}</span>
              </p>
              <a
                href="https://chunked.xyz"
                className="text-primary hover:underline text-sm"
              >
                play the game →
              </a>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline">search another wallet</Button>
          </Link>
        </div>

        {userData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsOverview
              stats={userData}
              title="user statistics"
              description="summary of activity"
            />

            <BlockStats title="collected items" items={userData.minedBlocks} />
            <BlockStats title="placed items" items={userData.placedBlocks} />
            <BlockStats title="created items" items={userData.craftedItems} />

            {/* Item Type Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>item type interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    unique types collected: {userData.minedBlockTypes.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    unique types placed: {userData.placedBlockTypes.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    unique types created: {userData.craftedItemTypes.length}
                  </p>
                  <div className="pt-2">
                    <p className="text-sm font-medium">
                      most frequently collected:
                    </p>
                    <p className="font-bold">
                      {userData.minedBlocks.length > 0
                        ? `${blockTypeNames[userData.minedBlocks[0].blockType & 0xffff] || `item ${userData.minedBlocks[0].blockType & 0xffff}`} (${userData.minedBlocks[0].count})`
                        : "none"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="col-span-full p-6">
            <p className="text-center text-muted-foreground">
              loading user data or no data available...
            </p>
          </Card>
        )}

        {/* Add Inventory Stats */}
        {walletAddress && userInventoryData && (
          <InventoryStats stats={userInventoryData} />
        )}

        {/* Add Inventory Card */}
        {walletAddress && inventoryState && (
          <Card className="col-span-full mt-6">
            <CardHeader className="pb-2">
              <CardTitle>user inventory</CardTitle>
              <CardDescription>
                current items in user's inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-2xl mx-auto p-8">
                {/* Quick Access Row (1 row x 9 columns) */}
                <div className="grid grid-cols-9 gap-2 mb-6 relative">
                  {Array.from({ length: 9 }).map((_, index) => {
                    const slotIndex = index
                    const item = (
                      inventoryState as unknown as InventoryData
                    )?.getInventoryContents?.[walletAddress]?.items.find(
                      (item) => item.slot === slotIndex,
                    )
                    const slotId = `quick-slot-${slotIndex}`

                    return (
                      <div
                        key={slotId}
                        className={`aspect-square ${item ? "bg-black/5 dark:bg-white/90" : "bg-black/10 dark:bg-white/75"} hover:bg-black/10 dark:hover:bg-white/80 rounded-lg shadow-sm relative group transition-all duration-200 p-0.5`}
                      >
                        {item ? (
                          <div className="absolute inset-0 p-1.5">
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center">
                                <p className="font-medium text-xs text-black/90 dark:text-black/80">
                                  {blockTypeNames[item.itemId & 0xffff] ||
                                    `item ${item.itemId & 0xffff}`}
                                </p>
                              </div>
                            </div>
                            {item.amount > 1 && (
                              <span className="absolute bottom-1 right-1.5 text-xs font-medium text-black/70 dark:text-black/80">
                                {item.amount}
                              </span>
                            )}
                            {item.durability > 0 && (
                              <div className="absolute bottom-0.5 left-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="h-0.5 bg-black/5 dark:bg-black/10 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500/50"
                                    style={{
                                      width: `${(item.durability / 100) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="absolute inset-0 rounded-lg ring-1 ring-black/10 dark:ring-black/20" />
                        )}
                      </div>
                    )
                  })}
                  <div className="absolute -bottom-3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                </div>

                {/* Main Inventory (3 rows x 9 columns) */}
                <div className="grid grid-cols-9 gap-2">
                  {Array.from({ length: 27 }).map((_, index) => {
                    const row = Math.floor(index / 9)
                    const col = index % 9
                    const flippedRow = 2 - row
                    const newIndex = flippedRow * 9 + col + 9

                    const item = (
                      inventoryState as unknown as InventoryData
                    )?.getInventoryContents?.[walletAddress]?.items.find(
                      (item) => item.slot === newIndex,
                    )
                    const slotId = `inventory-slot-${newIndex}`

                    return (
                      <div
                        key={slotId}
                        className={`aspect-square ${item ? "bg-black/5 dark:bg-white/90" : "bg-black/10 dark:bg-white/75"} hover:bg-black/10 dark:hover:bg-white/80 rounded-lg shadow-sm relative group transition-all duration-200 p-0.5`}
                      >
                        {item ? (
                          <div className="absolute inset-0 p-1.5">
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center">
                                <p className="font-medium text-xs text-black/90 dark:text-black/80">
                                  {blockTypeNames[item.itemId & 0xffff] ||
                                    `item ${item.itemId & 0xffff}`}
                                </p>
                              </div>
                            </div>
                            {item.amount > 1 && (
                              <span className="absolute bottom-1 right-1.5 text-xs font-medium text-black/70 dark:text-black/80">
                                {item.amount}
                              </span>
                            )}
                            {item.durability > 0 && (
                              <div className="absolute bottom-0.5 left-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="h-0.5 bg-black/5 dark:bg-black/10 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500/50"
                                    style={{
                                      width: `${(item.durability / 100) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="absolute inset-0 rounded-lg ring-1 ring-black/10 dark:ring-black/20" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
