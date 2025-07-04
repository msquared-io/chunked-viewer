import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { useEtherstore } from "@msquared/etherbase-client"
import type { GlobalStats, GlobalInventoryStats } from "../types/stats"
import { StatsOverview } from "../components/stats/StatsOverview"
import { BlockStats } from "../components/stats/BlockStats"
import { InventoryStats } from "../components/stats/InventoryStats"
import { AuroraText } from "../components/magicui/aurora-text"
import { formatNumber } from "@/lib/utils"

import { InventorySystemAddress } from "@/contracts/InventorySystemAddress"
import { UserStatsSystemAddress } from "@/contracts/UserStatsSystemAddress"

interface GlobalCounter {
  totalCount: bigint
  lastUpdateTimestamp: bigint
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

export default function HomePage() {
  const [walletAddress, setWalletAddress] = useState("")
  const navigate = useNavigate()

  const { state: globalCounterState } = useEtherstore({
    contractAddress: UserStatsSystemAddress,
    path: ["getGlobalCount"],
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

  const globalCounter = (
    globalCounterState as unknown as { getGlobalCount: GlobalCounter }
  )?.getGlobalCount

  const { state: globalStatsState } = useEtherstore({
    contractAddress: UserStatsSystemAddress,
    path: ["getGlobalStats"],
    options: {
      repoll: {
        onAnyContractEvent: false,
      },
    },
    // options: {
    //   repoll: {
    //     listenEvents: [
    //       {
    //         name: "GlobalCounterUpdated",
    //       },
    //     ],
    //   },
    // },
  })


  const { state: globalInventoryStatsState } = useEtherstore({
    contractAddress: UserStatsSystemAddress,
    path: ["getGlobalInventoryStats"],
    options: {
      repoll: {
        onAnyContractEvent: false,
        // listenEvents: [
        //   {
        //     name: "GlobalCounterUpdated",
        //   },
        // ],
      },
    },
  })

  console.log("globalStatsState", globalStatsState)
  console.log("globalInventoryStatsState", globalInventoryStatsState)

  // Cast and merge the states to our interface types
  const globalStats = (
    globalStatsState as unknown as { getGlobalStats: GlobalStats }
  )?.getGlobalStats

  const globalInventoryStats = (
    globalInventoryStatsState as unknown as {
      getGlobalInventoryStats: GlobalInventoryStats
    }
  )?.getGlobalInventoryStats

  const totalTransactions = globalCounter?.totalCount
    ? decodeValue(globalCounter.totalCount.toString())
    : 0n

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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {/* Main Title Card - 80% */}
          <Card className="md:col-span-4">
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

          {/* Marketplace Card - 20% */}
          <Link
            to="/marketplace"
            className="md:col-span-1 group transform transition-transform hover:scale-105"
          >
            <Card className="h-full bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-primary/20">
              <CardContent className="p-4 flex flex-col items-center justify-center space-y-1 text-center">
                {/* Intro text */}
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground group-hover:text-primary">
                  visit the
                </p>

                {/* Aurora text headline */}
                <AuroraText
                  colors={["#3b82f6", "#8b5cf6", "#6366f1", "#06b6d4"]}
                  speed={1.2}
                  className="text-sm font-semibold"
                >
                  chunked marketplace
                </AuroraText>

                {/* Subtitle */}
                <p className="text-xs text-muted-foreground group-hover:text-primary/80">
                  trade blocks →
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 50/50 Split Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Global Counter Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">All Transactions</h2>
                <p className="text-5xl font-bold text-primary mb-2">
                  {formatNumber(totalTransactions, 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Last updated:{" "}
                  {new Date(
                    Number(decodeValue(globalCounter?.lastUpdateTimestamp.toString()) || 0) * 1000,
                  ).toLocaleString()}
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
