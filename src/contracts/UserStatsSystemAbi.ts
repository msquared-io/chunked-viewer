// Auto-generated ABI file for UserStatsSystem
export const UserStatsSystemAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sessionManager",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_registry",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "blockType",
        "type": "uint8"
      }
    ],
    "name": "BlockMined",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "blockType",
        "type": "uint8"
      }
    ],
    "name": "BlockPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalCount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "lastUpdateTimestamp",
        "type": "uint256"
      }
    ],
    "name": "GlobalCounterUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemType",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ItemBurned",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemType",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ItemCrafted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemType",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ItemMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "fromSlot",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "toSlot",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemType",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ItemMoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemType",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ItemTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "PlayerUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemType",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "quantity",
        "type": "uint128"
      }
    ],
    "name": "SellOrderPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemType",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "TradeRecorded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "AIR",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "offset",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "limit",
        "type": "uint256"
      }
    ],
    "name": "getAllUserInventoryStats",
    "outputs": [
      {
        "internalType": "uint64[]",
        "name": "totalMinted",
        "type": "uint64[]"
      },
      {
        "internalType": "uint64[]",
        "name": "totalBurned",
        "type": "uint64[]"
      },
      {
        "internalType": "uint64[]",
        "name": "totalMoved",
        "type": "uint64[]"
      },
      {
        "internalType": "uint64[]",
        "name": "totalTransferredOut",
        "type": "uint64[]"
      },
      {
        "internalType": "uint64[]",
        "name": "totalTransferredIn",
        "type": "uint64[]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemType",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.ItemTypeCount[][]",
        "name": "mintedItems",
        "type": "tuple[][]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemType",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.ItemTypeCount[][]",
        "name": "burnedItems",
        "type": "tuple[][]"
      },
      {
        "internalType": "uint256[][]",
        "name": "mintedItemTypes",
        "type": "uint256[][]"
      },
      {
        "internalType": "uint256[][]",
        "name": "mintedCounts",
        "type": "uint256[][]"
      },
      {
        "internalType": "uint256[][]",
        "name": "burnedItemTypes",
        "type": "uint256[][]"
      },
      {
        "internalType": "uint256[][]",
        "name": "burnedCounts",
        "type": "uint256[][]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "offset",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "limit",
        "type": "uint256"
      }
    ],
    "name": "getAllUserStats",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "userAddresses",
        "type": "address[]"
      },
      {
        "internalType": "uint64[]",
        "name": "totalMined",
        "type": "uint64[]"
      },
      {
        "internalType": "uint64[]",
        "name": "totalPlaced",
        "type": "uint64[]"
      },
      {
        "internalType": "uint64[]",
        "name": "totalPlayerUpdates",
        "type": "uint64[]"
      },
      {
        "internalType": "uint64[]",
        "name": "totalCrafted",
        "type": "uint64[]"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "blockType",
            "type": "uint8"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.BlockTypeCount[][]",
        "name": "minedBlocks",
        "type": "tuple[][]"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "blockType",
            "type": "uint8"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.BlockTypeCount[][]",
        "name": "placedBlocks",
        "type": "tuple[][]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemType",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.ItemTypeCount[][]",
        "name": "craftedItems",
        "type": "tuple[][]"
      },
      {
        "internalType": "uint256[][]",
        "name": "minedBlockTypes",
        "type": "uint256[][]"
      },
      {
        "internalType": "uint256[][]",
        "name": "minedCounts",
        "type": "uint256[][]"
      },
      {
        "internalType": "uint256[][]",
        "name": "placedBlockTypes",
        "type": "uint256[][]"
      },
      {
        "internalType": "uint256[][]",
        "name": "placedCounts",
        "type": "uint256[][]"
      },
      {
        "internalType": "uint256[][]",
        "name": "craftedItemTypes",
        "type": "uint256[][]"
      },
      {
        "internalType": "uint256[][]",
        "name": "craftedCounts",
        "type": "uint256[][]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "offset",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "limit",
        "type": "uint256"
      }
    ],
    "name": "getAllUsers",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "users",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getComponentId",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGlobalCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalCount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastUpdateTimestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGlobalInventoryStats",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "totalMinted",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "totalBurned",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "totalMoved",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "totalTransferredOut",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "totalTransferredIn",
        "type": "uint64"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemType",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.ItemTypeCount[]",
        "name": "mintedItems",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemType",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.ItemTypeCount[]",
        "name": "burnedItems",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256[]",
        "name": "mintedItemTypes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "mintedCounts",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "burnedItemTypes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "burnedCounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGlobalSellStats",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "totalSellOrders",
        "type": "uint64"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemType",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.ItemTypeCount[]",
        "name": "sellOrderItems",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256[]",
        "name": "itemTypes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "sellCounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGlobalStats",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "totalMined",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "totalPlaced",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "totalPlayerUpdates",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "totalCrafted",
        "type": "uint64"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "blockType",
            "type": "uint8"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.BlockTypeCount[]",
        "name": "minedBlocks",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "blockType",
            "type": "uint8"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.BlockTypeCount[]",
        "name": "placedBlocks",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemType",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.ItemTypeCount[]",
        "name": "craftedItems",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256[]",
        "name": "minedBlockTypes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "minedCounts",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "placedBlockTypes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "placedCounts",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "craftedItemTypes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "craftedCounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGlobalTradeStats",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "totalTrades",
        "type": "uint64"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemType",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.ItemTypeCount[]",
        "name": "tradedItems",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256[]",
        "name": "itemTypes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "tradeCounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserInventoryStats",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "totalMinted",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "totalBurned",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "totalMoved",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "totalTransferredOut",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "totalTransferredIn",
        "type": "uint64"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemType",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.ItemTypeCount[]",
        "name": "mintedItems",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemType",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.ItemTypeCount[]",
        "name": "burnedItems",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256[]",
        "name": "mintedItemTypes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "mintedCounts",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "burnedItemTypes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "burnedCounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserSellStats",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "totalSellOrders",
        "type": "uint64"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemType",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.ItemTypeCount[]",
        "name": "sellOrderItems",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256[]",
        "name": "itemTypes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "sellCounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserStats",
    "outputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "internalType": "uint64",
        "name": "totalMined",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "totalPlaced",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "totalPlayerUpdates",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "totalCrafted",
        "type": "uint64"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "blockType",
            "type": "uint8"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.BlockTypeCount[]",
        "name": "minedBlocks",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "blockType",
            "type": "uint8"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.BlockTypeCount[]",
        "name": "placedBlocks",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemType",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.ItemTypeCount[]",
        "name": "craftedItems",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256[]",
        "name": "minedBlockTypes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "minedCounts",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "placedBlockTypes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "placedCounts",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "craftedItemTypes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "craftedCounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserTradeStats",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "totalTrades",
        "type": "uint64"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemType",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "count",
            "type": "uint64"
          }
        ],
        "internalType": "struct IUserStatsSystem.ItemTypeCount[]",
        "name": "tradedItems",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256[]",
        "name": "itemTypes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "tradeCounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "blockType",
        "type": "uint8"
      }
    ],
    "name": "recordBlockMined",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "blockType",
        "type": "uint8"
      }
    ],
    "name": "recordBlockPlaced",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "itemType",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "amount",
        "type": "uint64"
      }
    ],
    "name": "recordItemBurned",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "itemType",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "amount",
        "type": "uint64"
      }
    ],
    "name": "recordItemCrafted",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "itemType",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "amount",
        "type": "uint64"
      }
    ],
    "name": "recordItemMinted",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "fromSlot",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "toSlot",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "itemType",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "amount",
        "type": "uint64"
      }
    ],
    "name": "recordItemMoved",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "itemType",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "amount",
        "type": "uint64"
      }
    ],
    "name": "recordItemTransferred",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "recordPlayerUpdate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "itemType",
        "type": "uint256"
      },
      {
        "internalType": "uint128",
        "name": "quantity",
        "type": "uint128"
      }
    ],
    "name": "recordSellOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "itemType",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "name": "recordTrade",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registry",
    "outputs": [
      {
        "internalType": "contract Registry",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sessionManager",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_registry",
        "type": "address"
      }
    ],
    "name": "setRegistry",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_sessionManager",
        "type": "address"
      }
    ],
    "name": "updateSessionManager",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
