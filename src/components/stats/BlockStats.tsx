import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { BlockCount, ItemCount } from "../../types/stats"
import { blockTypeNames } from "../../constants/blockTypes"

interface BlockStatsProps {
  title: string
  items: Array<BlockCount | ItemCount>
}

export function BlockStats({ title, items }: BlockStatsProps) {
  const getItemKey = (item: BlockCount | ItemCount): string => {
    const type = "blockType" in item ? item.blockType : item.itemType
    return (type & 0xffff).toString()
  }

  const getItemName = (item: BlockCount | ItemCount): string => {
    const type = "blockType" in item ? item.blockType : item.itemType
    const typeId = type & 0xffff
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
            items.map((item) => (
              <div
                key={`${title}-${getItemKey(item)}`}
                className="flex justify-between items-center"
              >
                <a
                  href={`https://shannon-explorer.somnia.network/token/0xee10C818b65727b7BE02B66a15B57CbeCA760478/instance/${getTokenId(item)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  {getItemName(item)}
                </a>
                <p className="text-muted-foreground">{item.count}</p>
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
