export const SessionManagerAbi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "ECDSAInvalidSignature",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "length",
          "type": "uint256"
        }
      ],
      "name": "ECDSAInvalidSignatureLength",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "ECDSAInvalidSignatureS",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidShortString",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "str",
          "type": "string"
        }
      ],
      "name": "StringTooLong",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "EIP712DomainChanged",
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
          "indexed": true,
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "executor",
          "type": "address"
        }
      ],
      "name": "ExecutorAdded",
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
          "indexed": true,
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "initialBalance",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "expiryTime",
          "type": "uint32"
        }
      ],
      "name": "SessionCreated",
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
          "indexed": true,
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "refundAmount",
          "type": "uint256"
        }
      ],
      "name": "SessionRevoked",
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
          "indexed": true,
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newBalance",
          "type": "uint256"
        }
      ],
      "name": "SessionTopUp",
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
          "indexed": true,
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newBalance",
          "type": "uint256"
        }
      ],
      "name": "SessionWithdrawal",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "expiryTime",
          "type": "uint32"
        },
        {
          "internalType": "address[]",
          "name": "authorizedExecutors",
          "type": "address[]"
        },
        {
          "internalType": "address[]",
          "name": "authorizedContracts",
          "type": "address[]"
        },
        {
          "internalType": "bytes4[]",
          "name": "authorizedFunctions",
          "type": "bytes4[]"
        },
        {
          "internalType": "string",
          "name": "message",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "createSession",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "eip712Domain",
      "outputs": [
        {
          "internalType": "bytes1",
          "name": "fields",
          "type": "bytes1"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "version",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "chainId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "verifyingContract",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "salt",
          "type": "bytes32"
        },
        {
          "internalType": "uint256[]",
          "name": "extensions",
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
        },
        {
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "executeOnBehalf",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
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
          "internalType": "address[]",
          "name": "authorizedExecutors",
          "type": "address[]"
        },
        {
          "internalType": "address[]",
          "name": "authorizedContracts",
          "type": "address[]"
        },
        {
          "internalType": "bytes4[]",
          "name": "authorizedFunctions",
          "type": "bytes4[]"
        }
      ],
      "name": "generateSessionId",
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
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        }
      ],
      "name": "getAuthorizedExecutors",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
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
          "name": "sessionId",
          "type": "uint256"
        }
      ],
      "name": "getBalance",
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
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "address[]",
          "name": "authorizedExecutors",
          "type": "address[]"
        },
        {
          "internalType": "address[]",
          "name": "authorizedContracts",
          "type": "address[]"
        },
        {
          "internalType": "bytes4[]",
          "name": "authorizedFunctions",
          "type": "bytes4[]"
        }
      ],
      "name": "getSession",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "message",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            },
            {
              "internalType": "address[]",
              "name": "authorizedExecutors",
              "type": "address[]"
            },
            {
              "internalType": "address[]",
              "name": "authorizedContracts",
              "type": "address[]"
            },
            {
              "internalType": "bytes4[]",
              "name": "authorizedFunctions",
              "type": "bytes4[]"
            },
            {
              "internalType": "uint32",
              "name": "startTime",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "expiryTime",
              "type": "uint32"
            },
            {
              "internalType": "uint256",
              "name": "sessionId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "balance",
              "type": "uint256"
            }
          ],
          "internalType": "struct SessionManager.SessionPermission",
          "name": "",
          "type": "tuple"
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
          "name": "sessionId",
          "type": "uint256"
        }
      ],
      "name": "getSessionAuthList",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "contracts",
          "type": "address[]"
        },
        {
          "internalType": "bytes4[]",
          "name": "functions",
          "type": "bytes4[]"
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
          "name": "sessionId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "executor",
          "type": "address"
        }
      ],
      "name": "isAuthorizedExecutor",
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
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        },
        {
          "internalType": "bytes4",
          "name": "selector",
          "type": "bytes4"
        }
      ],
      "name": "isCallAuthorized",
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
          "name": "",
          "type": "address"
        }
      ],
      "name": "nonces",
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
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        }
      ],
      "name": "revokeSession",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "sessions",
      "outputs": [
        {
          "internalType": "string",
          "name": "message",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "uint32",
          "name": "startTime",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "expiryTime",
          "type": "uint32"
        },
        {
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "balance",
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
          "name": "sessionId",
          "type": "uint256"
        }
      ],
      "name": "topUpSession",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "withdrawFromSession",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const;