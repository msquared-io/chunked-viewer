import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import {
  useEtherbaseEvents,
  useEtherstore,
  type EtherbaseEvent,
} from "@msquared/etherbase-client"
import type { GlobalStats, GlobalInventoryStats } from "../types/stats"
import { StatsOverview } from "../components/stats/StatsOverview"
import { BlockStats } from "../components/stats/BlockStats"
import { InventoryStats } from "../components/stats/InventoryStats"

interface GlobalCounterEvent extends EtherbaseEvent {
  args: {
    totalCount: bigint
    lastUpdateTimestamp: bigint
  }
}

export default function HomePage() {
  const [walletAddress, setWalletAddress] = useState("")
  const [totalCount, setTotalCount] = useState<number>(0)
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<number>(0)
  const navigate = useNavigate()

  const handleGlobalCounterUpdate = useCallback((event: EtherbaseEvent) => {
    const { totalCount, lastUpdateTimestamp } = (event as GlobalCounterEvent)
      .args
    setTotalCount(Number(totalCount))
    setLastUpdateTimestamp(Number(lastUpdateTimestamp))
  }, [])

  useEtherbaseEvents({
    contractAddress: "0x33369304d80935d3cCdA0b00DE544526688c9Daf",
    events: [
      {
        name: "GlobalCounterUpdated",
      },
    ],
    onEvent: handleGlobalCounterUpdate,
  })

  const { state: globalStatsState } = useEtherstore({
    contractAddress: "0x33369304d80935d3cCdA0b00DE544526688c9Daf",
    path: ["getGlobalStats"],
    options: {
      repoll: {
        listenEvents: [
          {
            name: "GlobalCounterUpdated",
          },
        ],
      },
    },
  })

  const { state: globalInventoryStatsState } = useEtherstore({
    contractAddress: "0x33369304d80935d3cCdA0b00DE544526688c9Daf",
    path: ["getGlobalInventoryStats"],
    options: {
      repoll: {
        listenEvents: [
          {
            name: "GlobalCounterUpdated",
          },
        ],
      },
    },
  })

  console.log("globalStatsState", globalStatsState)
  console.log("globalInventoryStatsState", globalInventoryStatsState)

  // Cast the state to our interface types
  const globalStats = (
    globalStatsState as unknown as { getGlobalStats: GlobalStats }
  ).getGlobalStats
  const globalInventoryStats = (
    globalInventoryStatsState as unknown as {
      getGlobalInventoryStats: GlobalInventoryStats
    }
  ).getGlobalInventoryStats

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (walletAddress.trim() && walletAddress.startsWith("0x")) {
      navigate(`/users/${walletAddress}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-background p-4">
      <div className="w-full max-w-5xl">
        {/* Title Section */}
        <div className="flex justify-center mb-8">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-center">
                <a
                  href="https://chunked.xyz"
                  className="hover:text-primary transition-colors"
                >
                  chunked stats
                </a>
              </CardTitle>
              <CardDescription className="text-center">
                <div className="mt-1 text-lg">
                  <a
                    href="https://chunked.xyz"
                    className="text-primary hover:underline"
                  >
                    play the game →
                  </a>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* 50/50 Split Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Global Counter Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">All Transactions</h2>
                <p className="text-5xl font-bold text-primary mb-2">
                  {totalCount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Last updated:{" "}
                  {new Date(lastUpdateTimestamp * 1000).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Inspector Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Wallet Inspector</CardTitle>
              <CardDescription>
                Enter a wallet address to view detailed statistics and inventory
                for any player
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex items-start gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="enter wallet address (0x...)"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button
                  type="submit"
                  className="self-start"
                  disabled={
                    !walletAddress.trim() || !walletAddress.startsWith("0x")
                  }
                >
                  inspect
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Global Stats Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-6">global</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {globalStats && (
              <>
                <StatsOverview
                  stats={globalStats}
                  title="chunked global stats"
                  description="minecraft activity summary"
                />
                <BlockStats
                  title="top mined blocks"
                  items={globalStats.minedBlocks}
                />
                <BlockStats
                  title="top placed blocks"
                  items={globalStats.placedBlocks}
                />
                <BlockStats
                  title="top crafted items"
                  items={globalStats.craftedItems}
                />
              </>
            )}
          </div>

          {/* Global Inventory Stats */}
          {globalInventoryStats && (
            <InventoryStats
              stats={globalInventoryStats}
              title="global inventory stats"
              description="minted and burned items data"
            />
          )}
        </div>
      </div>
    </div>
  )
}
