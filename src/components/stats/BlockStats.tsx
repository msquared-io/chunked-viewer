import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import type { BlockCount, ItemCount } from "../../types/stats"
import { blockTypeNames } from "../../constants/blockTypes"
import { formatNumber } from "../../lib/utils"

interface BlockStatsProps {
  title: string
  items: Array<BlockCount | ItemCount>
}

export function BlockStats({ title, items }: BlockStatsProps) {
  const getItemKey = (item: BlockCount | ItemCount): string => {
    const type = "blockType" in item ? item.blockType : item.itemType
    return (type & 0x3ff).toString()
  }

  const getItemName = (item: BlockCount | ItemCount): string => {
    const type = "blockType" in item ? item.blockType : item.itemType
    const typeId = type & 0x3ff
    return blockTypeNames[typeId] || `item ${typeId}`
  }

  const getTokenId = (item: BlockCount | ItemCount): number => {
    const type = "blockType" in item ? item.blockType : item.itemType
    return type
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length > 0 ? (
            [...items]
              .sort((a, b) => b.count - a.count)
              .map((item) => (
                <div
                  key={`${title}-${getItemKey(item)}`}
                  className="flex justify-between items-center"
                >
                  <a
                    href={`https://shannon-explorer.somnia.network/token/0x42ee6f3Ef643524d3184BB6BF68763C8F966E84F/instance/${getTokenId(item)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    {getItemName(item)}
                  </a>
                  <p className="text-muted-foreground">
                    {formatNumber(item.count, 0)}
                  </p>
                </div>
              ))
          ) : (
            <p className="text-muted-foreground">no items yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
