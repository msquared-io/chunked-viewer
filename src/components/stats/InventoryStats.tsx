import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import type { InventoryStats, ItemCount } from "../../types/stats"
import { blockTypeNames } from "../../constants/blockTypes"

interface InventoryStatsProps {
  stats: InventoryStats
  title?: string
  description?: string
}

interface GroupedItem {
  name: string
  count: number
  tokenId: number
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

  const groupItemsByName = (items: ItemCount[]): GroupedItem[] => {
    const groupedMap = new Map<string, { count: number; tokenId: number }>()

    for (const item of items) {
      const name = getItemName(item.itemType)
      const typeId = item.itemType
      groupedMap.set(name, {
        count: (groupedMap.get(name)?.count || 0) + item.count,
        tokenId: typeId,
      })
    }

    return Array.from(groupedMap.entries()).map(
      ([name, { count, tokenId }]) => ({
        name,
        count,
        tokenId,
      }),
    )
  }

  const groupedMintedItems = groupItemsByName(stats.mintedItems)
  const groupedBurnedItems = groupItemsByName(stats.burnedItems)

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
              {groupedMintedItems.map((item) => (
                <div
                  key={`minted-${item.name}`}
                  className="flex justify-between items-center"
                >
                  <a
                    href={`https://shannon-explorer.somnia.network/token/0xee10C818b65727b7BE02B66a15B57CbeCA760478/instance/${item.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    {item.name}
                  </a>
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
              {groupedBurnedItems.length > 0 ? (
                groupedBurnedItems.map((item) => (
                  <div
                    key={`burned-${item.name}`}
                    className="flex justify-between items-center"
                  >
                    <a
                      href={`https://shannon-explorer.somnia.network/token/0xee10C818b65727b7BE02B66a15B57CbeCA760478/instance/${item.tokenId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {item.name}
                    </a>
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
