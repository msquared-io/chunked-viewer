// Auto-generated ABI file for Marketplace
export const MarketplaceAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sessionManager",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "_feeRecipient",
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
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint32",
        "name": "id",
        "type": "uint32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "qty",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "price",
        "type": "uint128"
      }
    ],
    "name": "AskPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint32",
        "name": "id",
        "type": "uint32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "qty",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "price",
        "type": "uint128"
      }
    ],
    "name": "BidPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FeeCollected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint32",
        "name": "id",
        "type": "uint32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "OrderCancelled",
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
        "internalType": "uint32",
        "name": "askId",
        "type": "uint32"
      },
      {
        "indexed": true,
        "internalType": "uint32",
        "name": "bidId",
        "type": "uint32"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "qty",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "price",
        "type": "uint128"
      }
    ],
    "name": "Trade",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "FEE_BPS",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_MATCH_ITERATIONS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_USER_ORDERS_QUERY",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      }
    ],
    "name": "aggregatedBuyQty",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      }
    ],
    "name": "aggregatedSellQty",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "askId",
        "type": "uint32"
      },
      {
        "internalType": "uint128",
        "name": "qty",
        "type": "uint128"
      }
    ],
    "name": "buyExact",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "id",
        "type": "uint32"
      }
    ],
    "name": "cancel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeRecipient",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      }
    ],
    "name": "getMarketStats",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "bestAskPrice",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "bestBidPrice",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "spread",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "askDepth",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "bidDepth",
        "type": "uint128"
      },
      {
        "internalType": "uint256",
        "name": "totalAskQty",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalBidQty",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      }
    ],
    "name": "getOrderBookDepth",
    "outputs": [
      {
        "internalType": "uint128[]",
        "name": "askPrices",
        "type": "uint128[]"
      },
      {
        "internalType": "uint128[]",
        "name": "askQtys",
        "type": "uint128[]"
      },
      {
        "internalType": "uint128[]",
        "name": "bidPrices",
        "type": "uint128[]"
      },
      {
        "internalType": "uint128[]",
        "name": "bidQtys",
        "type": "uint128[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTopAsks",
    "outputs": [
      {
        "internalType": "uint128[]",
        "name": "prices",
        "type": "uint128[]"
      },
      {
        "internalType": "uint128[]",
        "name": "qtys",
        "type": "uint128[]"
      },
      {
        "internalType": "uint256[]",
        "name": "itemIds",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      }
    ],
    "name": "getTopAsksForItem",
    "outputs": [
      {
        "internalType": "uint128[]",
        "name": "prices",
        "type": "uint128[]"
      },
      {
        "internalType": "uint128[]",
        "name": "qtys",
        "type": "uint128[]"
      },
      {
        "internalType": "uint32[]",
        "name": "orderIds",
        "type": "uint32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "limit",
        "type": "uint256"
      }
    ],
    "name": "getTopAsksForItem",
    "outputs": [
      {
        "internalType": "uint128[]",
        "name": "prices",
        "type": "uint128[]"
      },
      {
        "internalType": "uint128[]",
        "name": "qtys",
        "type": "uint128[]"
      },
      {
        "internalType": "uint32[]",
        "name": "orderIds",
        "type": "uint32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTopBids",
    "outputs": [
      {
        "internalType": "uint128[]",
        "name": "prices",
        "type": "uint128[]"
      },
      {
        "internalType": "uint128[]",
        "name": "qtys",
        "type": "uint128[]"
      },
      {
        "internalType": "uint256[]",
        "name": "itemIds",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      }
    ],
    "name": "getTopBidsForItem",
    "outputs": [
      {
        "internalType": "uint128[]",
        "name": "prices",
        "type": "uint128[]"
      },
      {
        "internalType": "uint128[]",
        "name": "qtys",
        "type": "uint128[]"
      },
      {
        "internalType": "uint32[]",
        "name": "orderIds",
        "type": "uint32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "limit",
        "type": "uint256"
      }
    ],
    "name": "getTopBidsForItem",
    "outputs": [
      {
        "internalType": "uint128[]",
        "name": "prices",
        "type": "uint128[]"
      },
      {
        "internalType": "uint128[]",
        "name": "qtys",
        "type": "uint128[]"
      },
      {
        "internalType": "uint32[]",
        "name": "orderIds",
        "type": "uint32[]"
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
    "name": "getUserAsks",
    "outputs": [
      {
        "internalType": "uint128[]",
        "name": "prices",
        "type": "uint128[]"
      },
      {
        "internalType": "uint128[]",
        "name": "qtys",
        "type": "uint128[]"
      },
      {
        "internalType": "uint256[]",
        "name": "itemIds",
        "type": "uint256[]"
      },
      {
        "internalType": "uint32[]",
        "name": "orderIds",
        "type": "uint32[]"
      },
      {
        "internalType": "uint256",
        "name": "totalCount",
        "type": "uint256"
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
    "name": "getUserBids",
    "outputs": [
      {
        "internalType": "uint128[]",
        "name": "prices",
        "type": "uint128[]"
      },
      {
        "internalType": "uint128[]",
        "name": "qtys",
        "type": "uint128[]"
      },
      {
        "internalType": "uint256[]",
        "name": "itemIds",
        "type": "uint256[]"
      },
      {
        "internalType": "uint32[]",
        "name": "orderIds",
        "type": "uint32[]"
      },
      {
        "internalType": "uint256",
        "name": "totalCount",
        "type": "uint256"
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
        "internalType": "uint256",
        "name": "offset",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "limit",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "asksOnly",
        "type": "bool"
      }
    ],
    "name": "getUserOrders",
    "outputs": [
      {
        "internalType": "uint128[]",
        "name": "prices",
        "type": "uint128[]"
      },
      {
        "internalType": "uint128[]",
        "name": "qtys",
        "type": "uint128[]"
      },
      {
        "internalType": "uint256[]",
        "name": "itemIds",
        "type": "uint256[]"
      },
      {
        "internalType": "uint32[]",
        "name": "orderIds",
        "type": "uint32[]"
      },
      {
        "internalType": "uint256",
        "name": "totalCount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "hasMore",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC1155BatchReceived",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC1155Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "name": "orders",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "qty",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "price",
        "type": "uint128"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "nextInPrice",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "prevInPrice",
        "type": "uint32"
      },
      {
        "internalType": "bool",
        "name": "isAsk",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
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
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "internalType": "uint128",
        "name": "qty",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "price",
        "type": "uint128"
      }
    ],
    "name": "placeAsk",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "id",
        "type": "uint32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool[]",
        "name": "isAsks",
        "type": "bool[]"
      },
      {
        "internalType": "uint256[]",
        "name": "itemIds",
        "type": "uint256[]"
      },
      {
        "internalType": "uint128[]",
        "name": "qtys",
        "type": "uint128[]"
      },
      {
        "internalType": "uint128[]",
        "name": "prices",
        "type": "uint128[]"
      }
    ],
    "name": "placeBatchOrders",
    "outputs": [
      {
        "internalType": "uint32[]",
        "name": "orderIds",
        "type": "uint32[]"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "internalType": "uint128",
        "name": "qty",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "price",
        "type": "uint128"
      }
    ],
    "name": "placeBid",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "id",
        "type": "uint32"
      }
    ],
    "stateMutability": "payable",
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
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
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
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
] as const;
