import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import type { InventoryStats } from "../../types/stats"
import { blockTypeNames } from "../../constants/blockTypes"

interface InventoryStatsProps {
  stats: InventoryStats
  title?: string
  description?: string
}

export function InventoryStats({
  stats,
  title = "inventory statistics",
  description = "data about minted and burned items",
}: InventoryStatsProps) {
  const getItemName = (itemType: number): string => {
    const typeId = itemType & 0xffff
    return blockTypeNames[typeId] || `item ${typeId}`
  }

  return (
    <Card className="col-span-full mt-6">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Minted Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">minted items</h3>
            <div className="space-y-2">
              <div className="flex justify-between mb-2">
                <p className="font-medium text-muted-foreground">
                  total minted:
                </p>
                <p>{stats.totalMinted}</p>
              </div>
              {stats.mintedItems.map((item) => (
                <div
                  key={`minted-${item.itemType & 0xffff}`}
                  className="flex justify-between items-center"
                >
                  <p className="font-medium">{getItemName(item.itemType)}</p>
                  <p className="text-muted-foreground">{item.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Burned Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">burned items</h3>
            <div className="space-y-2">
              <div className="flex justify-between mb-2">
                <p className="font-medium text-muted-foreground">
                  total burned:
                </p>
                <p>{stats.totalBurned}</p>
              </div>
              {stats.burnedItems.length > 0 ? (
                stats.burnedItems.map((item) => (
                  <div
                    key={`burned-${item.itemType & 0xffff}`}
                    className="flex justify-between items-center"
                  >
                    <p className="font-medium">{getItemName(item.itemType)}</p>
                    <p className="text-muted-foreground">{item.count}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">no items burned yet</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
