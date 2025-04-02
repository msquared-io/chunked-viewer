export interface BlockCount {
  blockType: number
  count: number
}

export interface ItemCount {
  itemType: number
  count: number
}

export interface BaseStats {
  totalMined: number
  totalPlaced: number
  totalCrafted: number
  totalDistance: number
  minedBlockTypes: number[]
  minedBlocks: BlockCount[]
  minedCounts: number[]
  placedBlockTypes: number[]
  placedBlocks: BlockCount[]
  placedCounts: number[]
  craftedItemTypes: number[]
  craftedItems: ItemCount[]
  craftedCounts: number[]
}

export interface GlobalStats extends BaseStats {}

export interface UserStats extends BaseStats {
  userAddress: string
}

export interface InventoryStats {
  totalMinted: number
  totalBurned: number
  totalMoved: number
  mintedItemTypes: number[]
  mintedItems: ItemCount[]
  mintedCounts: number[]
  burnedItemTypes: number[]
  burnedItems: ItemCount[]
  burnedCounts: number[]
}

export interface GlobalInventoryStats extends InventoryStats {}

export interface UserInventoryStats extends InventoryStats {}
