# Etherbase Client API Documentation

## React Hooks

These hooks follow the React Hooks pattern and must be used within React components.

### useContract

`import { useContract } from "@msquared/etherbase-client"`

**Parameters:**

- `param`: `Readonly<{ contractAddress: `0x${string}`; abi?: TAbi | undefined; }>`

**Returns:** `{ read: <TMethodName extends TAbi extends Abi ? ExtractAbiFunctionNames<TAbi> : string>(props: TAbi extends Abi ? { methodName: TMethodName; args: MethodArgs<...>; } : { ...; }) => Promise<...>; execute: <TMethodName extends TAbi extends Abi ? ExtractAbiFunctionNames<...> : string>(props: TAbi extends Abi ? { ...; }...`

**Return Object Properties:**

- `read`: `<TMethodName extends TAbi extends Abi ? ExtractAbiFunctionNames<TAbi> : string>(props: TAbi extends Abi ? { methodName: TMethodName; args: MethodArgs<...>; } : { ...; }) => Promise<...>`
- `execute`: `<TMethodName extends TAbi extends Abi ? ExtractAbiFunctionNames<TAbi> : string>(props: TAbi extends Abi ? { methodName: TMethodName; args: MethodArgs<...>; } : { ...; }) => Promise<...>`
- `subscribeToState`: `(props: { onStateChange: (state: EtherstoreState) => void; options?: StateSubscriptionOptions | undefined; path?: (string | string[])[] | undefined; paths?: string[][] | undefined; resubscribeOnReconnect?: boolean | undefined; }) => Promise<...>`
- `subscribeToEvents`: `(props: { events: Event<TAbi>[]; onEvent: (event: EtherbaseEvent<TAbi>) => void; maxEventsPerBlock?: number | undefined; }) => { unsubscribe: () => void; isSubscribed: () => boolean; getError: () => string | undefined; }`
- `error`: `string | undefined`

---

### useContractRegistry

`import { useContractRegistry } from "@msquared/etherbase-client"`

**Returns:** `{ registryAddress: `0x${string}` | null; createOrg: (metadataURI: string) => Promise<TransactionReceipt>; setOrgMetadataURI: (id: number, newMetadataURI: string) => Promise<...>; ... 10 more ...; fetchGroupContracts: (gid: number, offset?: number, limit?: number, config?: EtherbaseConfig | undefined) => Promise<...>...`

**Return Object Properties:**

- `registryAddress`: ``0x${string}` | null`
- `createOrg`: `(metadataURI: string) => Promise<TransactionReceipt>`
- `setOrgMetadataURI`: `(id: number, newMetadataURI: string) => Promise<TransactionReceipt>`
- `deleteOrg`: `(id: number) => Promise<TransactionReceipt>`
- `createGroup`: `(orgId: number, metadataURI: string) => Promise<TransactionReceipt>`
- `updateGroup`: `(gid: number, metadataURI: string) => Promise<TransactionReceipt>`
- `deleteGroup`: `(gid: number) => Promise<TransactionReceipt>`
- `registerContract`: `(target: `0x${string}`, abi: Abi, doc: string, name: string, description: string) => Promise<TransactionReceipt>`
- `assignContractToGroup`: `(gid: number, target: `0x${string}`) => Promise<TransactionReceipt>`
- `updateContractInfo`: `(target: `0x${string}`, name: string, description: string) => Promise<TransactionReceipt>`
- `removeContract`: `(target: `0x${string}`) => Promise<TransactionReceipt>`
- `fetchOrgs`: `(offset?: number, limit?: number, config?: EtherbaseConfig | undefined) => Promise<any>`
- `fetchOrgGroups`: `(orgId: number, offset?: number, limit?: number, config?: EtherbaseConfig | undefined) => Promise<any>`
- `fetchGroupContracts`: `(gid: number, offset?: number, limit?: number, config?: EtherbaseConfig | undefined) => Promise<any>`

---

### useDeepMemo

`import { useDeepMemo } from "@msquared/etherbase-client"`

A hook that memoizes a value using deep comparison.
Similar to useMemo but with deep equality checking.

**Parameters:**

- `value`: `T` - The value to memoize
- `deps`: `unknown[]` - The dependencies to compare

**Returns:** `T`

---

### useEtherbase

`import { useEtherbase } from "@msquared/etherbase-client"`

**Returns:** `{ createSource: () => Promise<{ receipt: TransactionReceipt; sourceAddress: `0x${string}`; }>; sources: Source[]; fetchSources: () => Promise<void>; ... 5 more ...; deleteCustomContract: (contractAddress: `0x${string}`) => Promise<...>; }`

**Return Object Properties:**

- `createSource`: `() => Promise<{ receipt: TransactionReceipt; sourceAddress: `0x${string}`; }>`
- `sources`: `Source[]`
- `fetchSources`: `() => Promise<void>`
- `customContracts`: `CustomContract[]`
- `customContract`: `CustomContract | null`
- `fetchCustomContracts`: `() => Promise<void>`
- `fetchCustomContract`: `(contractAddress: `0x${string}`) => Promise<void>`
- `addCustomContract`: `(contractAddress: `0x${string}`, contractAbi: string) => Promise<boolean>`
- `deleteCustomContract`: `(contractAddress: `0x${string}`) => Promise<boolean>`

---

### useEtherbaseContract

`import { useEtherbaseContract } from "@msquared/etherbase-client"`

**Parameters:**

- `param`: `Readonly<{ contractAddress: `0x${string}`; abi?: TAbi | undefined; }>`

**Returns:** `{ execute: ({ methodName, args, }: { methodName: TAbi extends Abi ? Extract<TAbi[number], { type: "function"; }>["name"] : string; args: Record<string, unknown>; }) => Promise<...>; }`

**Return Object Properties:**

- `execute`: `({ methodName, args, }: { methodName: TAbi extends Abi ? Extract<TAbi[number], { type: "function"; }>["name"] : string; args: Record<string, unknown>; }) => Promise<unknown>`

---

### useEtherbaseEvents

`import { useEtherbaseEvents } from "@msquared/etherbase-client"`

**Parameters:**

- `param`: `{ contractAddress?: `0x${string}` | undefined; events?: Event[] | undefined; onEvent: (event: EtherbaseEvent) => void; }`

**Returns:** `void`

---

### useEtherbasePermissions

`import { useEtherbasePermissions } from "@msquared/etherbase-client"`

**Parameters:**

- `param`: `Readonly<{ sourceAddress: `0x${string}`; }>`

**Returns:** `{ grantRoles: (walletAddress: `0x${string}`, roles: number[]) => Promise<void>; revokeIdentity: (walletAddress: `0x${string}`) => Promise<void>; grantRole: (walletAddress: `0x${string}`, role: number) => Promise<...>; revokeRole: (walletAddress: `0x${string}`, role: number) => Promise<...>; deposit: (targetAddress: ...`

**Return Object Properties:**

- `grantRoles`: `(walletAddress: `0x${string}`, roles: number[]) => Promise<void>`
- `revokeIdentity`: `(walletAddress: `0x${string}`) => Promise<void>`
- `grantRole`: `(walletAddress: `0x${string}`, role: number) => Promise<void>`
- `revokeRole`: `(walletAddress: `0x${string}`, role: number) => Promise<void>`
- `deposit`: `(targetAddress: `0x${string}`, amount: number) => Promise<void>`
- `fetchPermissions`: `() => Promise<{ walletAddress: string; roles: number[]; isOwner: boolean; balance: bigint; }[]>`
- `canGrantRoles`: `Record<number, boolean>`

---

### useEtherbaseSource

`import { useEtherbaseSource } from "@msquared/etherbase-client"`

**Parameters:**

- `param`: `UseEtherbaseSourceProps`

**Returns:** `{ error: string | null; setValue: (state: EtherstoreState) => Promise<void>; emitEvent: ({ name, args }: { name: string; args: Record<string, unknown>; }) => Promise<void>; eventDefinitions: { ...; }[]; fetchEventDefinitions: () => Promise<...>; registerEvent: (event: { ...; }) => Promise<...>; }`

**Return Object Properties:**

- `error`: `string | null`
- `setValue`: `(state: EtherstoreState) => Promise<void>`
- `emitEvent`: `({ name, args }: { name: string; args: Record<string, unknown>; }) => Promise<void>`
- `eventDefinitions`: `{ name: string; args: Argument[]; }[]`
- `fetchEventDefinitions`: `() => Promise<void>`
- `registerEvent`: `(event: { name: string; args: Argument[]; }) => Promise<void>`

---

### useEtherstore

`import { useEtherstore } from "@msquared/etherbase-client"`

**Parameters:**

- `param`: `Readonly<{ contractAddress: `0x${string}`; path?: EtherstoreCompoundPath | undefined; paths?: string[][] | undefined; options?: StateSubscriptionOptions | undefined; onStateChange?: ((state: EtherstoreState) => void) | undefined; }>`

**Returns:** `UseEtherstoreHookReturn`

**Return Object Properties:**

- `setState`: `(state: EtherstoreState, merge?: boolean | undefined) => Promise<void>`

---

### useLogin

`import { useLogin } from "@msquared/etherbase-client"`

**Parameters:**

- `param`: `{ privyLogin: () => Promise<void>; privyLoginAsGuest: () => Promise<void>; privyLogout: () => Promise<void>; privyGetWallets: () => Promise<`0x${string}`[]>; privyGetEmbeddedWallet: () => Promise<...>; signTypedData: SignTypedDataFunction; ready: boolean; autoLogin: boolean; }`

**Returns:** `{ loggedIn: boolean; loginState: LoginState; login: () => void; loginAsGuest: () => void; logout: () => void; cancelLogin: () => void; error: string | null; }`

**Return Object Properties:**

- `loggedIn`: `boolean`
- `loginState`: `LoginState`
- `login`: `() => void`
- `loginAsGuest`: `() => void`
- `logout`: `() => void`
- `cancelLogin`: `() => void`
- `error`: `string | null`

---

### useSession

`import { useSession } from "@msquared/etherbase-client"`

Hook for managing Etherbase sessions - provides session information and methods to manage session balance

**Returns:** `UseSessionReturn`

**Return Object Properties:**

- `sessionInfo`: `SessionInfo | null` - Current session information including ID, address, and balance
- `isLoading`: `boolean` - Whether the hook is currently loading session data
- `error`: `string | null` - Error message if any operation failed
- `refreshSession`: `() => Promise<void>` - Refreshes the current session information including balance
- `topUpSession`: `(amount: bigint) => Promise<string>` - Adds ETH to the current session balance. Returns transaction hash.
- `withdrawFromSession`: `(amount: bigint) => Promise<string>` - Withdraws ETH from the current session balance. Returns transaction hash.
- `clearCache`: `() => void` - Clears the session cache and resets session state
- `formatBalance`: `(balance: bigint) => string` - Formats a balance value for display (converts wei to ETH)

---

### useTransactionSender

`import { useTransactionSender } from "@msquared/etherbase-client"`

**Returns:** `{ sendTransaction: ({ to, value, data }: Readonly<{ to: `0x${string}`; value: bigint; data?: string | undefined; }>) => Promise<Readonly<{ hash: string; status: "error" | "success"; }>>; }`

**Return Object Properties:**

- `sendTransaction`: `({ to, value, data }: Readonly<{ to: `0x${string}`; value: bigint; data?: string | undefined; }>) => Promise<Readonly<{ hash: string; status: "error" | "success"; }>>`

---

## Types and Interfaces

### Argument

`import { Argument } from "@msquared/etherbase-client"`

---

### BinaryProtocolOptions

`import { BinaryProtocolOptions } from "@msquared/etherbase-client"`

---

### Component

`import { Component } from "@msquared/etherbase-client"`

---

### CreateEtherbaseEventsReturn

`import { CreateEtherbaseEventsReturn } from "@msquared/etherbase-client"`

---

### CreateEtherbasePermissionsProps

`import { CreateEtherbasePermissionsProps } from "@msquared/etherbase-client"`

---

### CreateEtherbaseSourceProps

`import { CreateEtherbaseSourceProps } from "@msquared/etherbase-client"`

---

### CreateEtherbaseSourceReturn

`import { CreateEtherbaseSourceReturn } from "@msquared/etherbase-client"`

---

### CreateEtherstoreProps

`import { CreateEtherstoreProps } from "@msquared/etherbase-client"`

---

### CreateEtherstoreReturn

`import { CreateEtherstoreReturn } from "@msquared/etherbase-client"`

---

### CreateTransactionSenderReturn

`import { CreateTransactionSenderReturn } from "@msquared/etherbase-client"`

---

### CustomContract

`import { CustomContract } from "@msquared/etherbase-client"`

---

### EIP712Domain

`import { EIP712Domain } from "@msquared/etherbase-client"`

---

### EIP712Message

`import { EIP712Message } from "@msquared/etherbase-client"`

---

### EIP712Types

`import { EIP712Types } from "@msquared/etherbase-client"`

---

### EmitEventProps

`import { EmitEventProps } from "@msquared/etherbase-client"`

---

### EtherbaseConfig

`import { EtherbaseConfig } from "@msquared/etherbase-client"`

---

### EtherbaseEvent

`import { EtherbaseEvent } from "@msquared/etherbase-client"`

---

### EtherstoreCompoundPath

`import { EtherstoreCompoundPath } from "@msquared/etherbase-client"`

---

### EtherstoreHookReturn

`import { EtherstoreHookReturn } from "@msquared/etherbase-client"`

---

### EtherstoreKey

`import { EtherstoreKey } from "@msquared/etherbase-client"`

---

### EtherstorePath

`import { EtherstorePath } from "@msquared/etherbase-client"`

---

### EtherstoreState

`import { EtherstoreState } from "@msquared/etherbase-client"`

---

### EtherstoreUpdate

`import { EtherstoreUpdate } from "@msquared/etherbase-client"`

---

### EtherstoreValue

`import { EtherstoreValue } from "@msquared/etherbase-client"`

---

### Event

`import { Event } from "@msquared/etherbase-client"`

---

### EventHandler

`import { EventHandler } from "@msquared/etherbase-client"`

---

### GetContractProps

`import { GetContractProps } from "@msquared/etherbase-client"`

---

### GetContractReturn

`import { GetContractReturn } from "@msquared/etherbase-client"`

---

### IO

`import { IO } from "@msquared/etherbase-client"`

---

### Item

`import { Item } from "@msquared/etherbase-client"`

---

### Protocol

`import { Protocol } from "@msquared/etherbase-client"`

---

### SendTransactionProps

`import { SendTransactionProps } from "@msquared/etherbase-client"`

---

### SendTransactionReturn

`import { SendTransactionReturn } from "@msquared/etherbase-client"`

---

### SessionInfo

`import { SessionInfo } from "@msquared/etherbase-client"`

Session information containing session ID, address, and balance

---

### SetValueProps

`import { SetValueProps } from "@msquared/etherbase-client"`

---

### SignTypedDataFunction

`import { SignTypedDataFunction } from "@msquared/etherbase-client"`

---

### SignTypedDataParams

`import { SignTypedDataParams } from "@msquared/etherbase-client"`

---

### Source

`import { Source } from "@msquared/etherbase-client"`

---

### StateFilter

`import { StateFilter } from "@msquared/etherbase-client"`

---

### StateSubscriptionOptions

`import { StateSubscriptionOptions } from "@msquared/etherbase-client"`

---

### StateUpdate

`import { StateUpdate } from "@msquared/etherbase-client"`

---

### StateUpdates

`import { StateUpdates } from "@msquared/etherbase-client"`

---

### SubscribeToEventsProps

`import { SubscribeToEventsProps } from "@msquared/etherbase-client"`

---

### SubscribeToEventsReturn

`import { SubscribeToEventsReturn } from "@msquared/etherbase-client"`

---

### SubscribeToStateProps

`import { SubscribeToStateProps } from "@msquared/etherbase-client"`

---

### SubscribeToStateReturn

`import { SubscribeToStateReturn } from "@msquared/etherbase-client"`

---

### Subscription

`import { Subscription } from "@msquared/etherbase-client"`

---

### UpdateStateProps

`import { UpdateStateProps } from "@msquared/etherbase-client"`

---

### UseContractProps

`import { UseContractProps } from "@msquared/etherbase-client"`

---

### UseEtherbaseContractProps

`import { UseEtherbaseContractProps } from "@msquared/etherbase-client"`

---

### UseEtherbaseEventsProps

`import { UseEtherbaseEventsProps } from "@msquared/etherbase-client"`

---

### UseEtherbaseEventsReturn

`import { UseEtherbaseEventsReturn } from "@msquared/etherbase-client"`

---

### UseEtherbasePermissionsProps

`import { UseEtherbasePermissionsProps } from "@msquared/etherbase-client"`

---

### UseEtherbaseSourceProps

`import { UseEtherbaseSourceProps } from "@msquared/etherbase-client"`

---

### UseEtherstoreHookProps

`import { UseEtherstoreHookProps } from "@msquared/etherbase-client"`

---

### UseSessionReturn

`import { UseSessionReturn } from "@msquared/etherbase-client"`

Return type for the useSession hook

---

### WebSocketEventUpdate

`import { WebSocketEventUpdate } from "@msquared/etherbase-client"`

---

### WebSocketStateUpdate

`import { WebSocketStateUpdate } from "@msquared/etherbase-client"`

---

### WebSocketStateUpdateInner

`import { WebSocketStateUpdateInner } from "@msquared/etherbase-client"`

---

### WebSocketUpdate

`import { WebSocketUpdate } from "@msquared/etherbase-client"`

---

### WebSocketUpdateData

`import { WebSocketUpdateData } from "@msquared/etherbase-client"`

---

## Functions

### clearSessionCache

`import { clearSessionCache } from "@msquared/etherbase-client"`

**Returns:** `void`

---

### convertAbiToItems

`import { convertAbiToItems } from "@msquared/etherbase-client"`

Converts a JSON ABI to the Item struct format required by the contract

**Parameters:**

- `abi`: `Abi`

**Returns:** `Item[]`

---

### createEtherbaseContract

`import { createEtherbaseContract } from "@msquared/etherbase-client"`

**Parameters:**

- `param`: `{ contractAddress: `0x${string}`; abi?: TAbi | undefined; }`

**Returns:** `CreateEtherbaseContractReturn<TAbi>`

---

### createEtherbaseContract

`import { createEtherbaseContract } from "@msquared/etherbase-client"`

**Parameters:**

- `param`: `{ contractAddress: `0x${string}`; abi?: TAbi | undefined; }`

**Returns:** `CreateEtherbaseContractReturn<TAbi>`

---

### createEtherbaseEvents

`import { createEtherbaseEvents } from "@msquared/etherbase-client"`

**Parameters:**

- `param`: `{ abi?: TAbi | undefined; }`

**Returns:** `Readonly<{ subscribeToEvents: (props: Readonly<{ contractAddress?: `0x${string}` | undefined; events?: Event<TAbi>[] | undefined; onEvent: (event: EtherbaseEvent<TAbi>) => void; abi?: TAbi | undefined; maxEventsPerBlock?: number | undefined; }>) => Readonly<...>; }>`

---

### createEtherbaseEvents

`import { createEtherbaseEvents } from "@msquared/etherbase-client"`

**Parameters:**

- `param`: `{ abi?: TAbi | undefined; }`

**Returns:** `Readonly<{ subscribeToEvents: (props: Readonly<{ contractAddress?: `0x${string}` | undefined; events?: Event<TAbi>[] | undefined; onEvent: (event: EtherbaseEvent<TAbi>) => void; abi?: TAbi | undefined; maxEventsPerBlock?: number | undefined; }>) => Readonly<...>; }>`

---

### createEtherbaseSource

`import { createEtherbaseSource } from "@msquared/etherbase-client"`

**Returns:** `Readonly<{ setValue: (props: Readonly<{ sourceAddress: `0x${string}`; state: EtherstoreState; }>) => Promise<unknown>; emitEvent: (props: Readonly<{ sourceAddress: `0x${string}`; name: string; args: Record<...>; }>) => Promise<...>; }>`

---

### createEtherbaseSource

`import { createEtherbaseSource } from "@msquared/etherbase-client"`

**Returns:** `Readonly<{ setValue: (props: Readonly<{ sourceAddress: `0x${string}`; state: EtherstoreState; }>) => Promise<unknown>; emitEvent: (props: Readonly<{ sourceAddress: `0x${string}`; name: string; args: Record<...>; }>) => Promise<...>; }>`

---

### createEtherstore

`import { createEtherstore } from "@msquared/etherbase-client"`

**Parameters:**

- `param`: `Readonly<{ contractAddress: `0x${string}`; initialOptions?: StateSubscriptionOptions | undefined; initialPath?: (string | string[])[] | undefined; initialPaths?: string[][] | undefined; }>`

**Returns:** `Readonly<{ getState: () => EtherstoreState; setState: (props: Readonly<{ newState: EtherstoreState; merge?: boolean | undefined; }>) => Promise<void>; subscribeToState: (props: Readonly<...>) => Promise<...>; isLoading: () => boolean; getError: () => string | undefined; }>`

---

### createEtherstore

`import { createEtherstore } from "@msquared/etherbase-client"`

**Parameters:**

- `param`: `Readonly<{ contractAddress: `0x${string}`; initialOptions?: StateSubscriptionOptions | undefined; initialPath?: (string | string[])[] | undefined; initialPaths?: string[][] | undefined; }>`

**Returns:** `Readonly<{ getState: () => EtherstoreState; setState: (props: Readonly<{ newState: EtherstoreState; merge?: boolean | undefined; }>) => Promise<void>; subscribeToState: (props: Readonly<...>) => Promise<...>; isLoading: () => boolean; getError: () => string | undefined; }>`

---

### createTransactionSender

`import { createTransactionSender } from "@msquared/etherbase-client"`

**Returns:** `Readonly<{ sendTransaction: (props: Readonly<{ to: `0x${string}`; value: bigint; data?: string | undefined; }>) => Promise<Readonly<{ hash: string; status: "error" | "success"; }>>; }>`

---

### createTransactionSender

`import { createTransactionSender } from "@msquared/etherbase-client"`

**Returns:** `Readonly<{ sendTransaction: (props: Readonly<{ to: `0x${string}`; value: bigint; data?: string | undefined; }>) => Promise<Readonly<{ hash: string; status: "error" | "success"; }>>; }>`

---

### deepMerge

`import { deepMerge } from "@msquared/etherbase-client"`

Deep merges state object 'source' into 'target'

**Parameters:**

- `target`: `EtherstoreState`
- `source`: `EtherstoreState`

**Returns:** `EtherstoreState`

---

### getConfig

`import { getConfig } from "@msquared/etherbase-client"`

**Returns:** `EtherbaseConfig`

---

### getContract

`import { getContract } from "@msquared/etherbase-client"`

**Parameters:**

- `param`: `Readonly<{ contractAddress: `0x${string}`; abi?: TAbi | undefined; }>`

**Returns:** `Readonly<{ read: <TMethodName extends TAbi extends Abi ? ExtractAbiFunctionNames<TAbi> : string>(props: TAbi extends Abi ? { methodName: TMethodName; args: MethodArgs<...>; } : { ...; }) => Promise<...>; subscribeToState: (props: { ...; }) => Promise<...>; subscribeToEvents: (props: { ...; }) => { ...; }; execute: <...`

---

### getContract

`import { getContract } from "@msquared/etherbase-client"`

**Parameters:**

- `param`: `Readonly<{ contractAddress: `0x${string}`; abi?: TAbi | undefined; }>`

**Returns:** `Readonly<{ read: <TMethodName extends TAbi extends Abi ? ExtractAbiFunctionNames<TAbi> : string>(props: TAbi extends Abi ? { methodName: TMethodName; args: MethodArgs<...>; } : { ...; }) => Promise<...>; subscribeToState: (props: { ...; }) => Promise<...>; subscribeToEvents: (props: { ...; }) => { ...; }; execute: <...`

---

### getPreferredWallet

`import { getPreferredWallet } from "@msquared/etherbase-client"`

**Returns:** ``0x${string}` | null`

---

### getSessionBalance

`import { getSessionBalance } from "@msquared/etherbase-client"`

**Returns:** `Promise<bigint>`

---

### getSessionInfo

`import { getSessionInfo } from "@msquared/etherbase-client"`

**Returns:** `{ sessionId: string; sessionAddress: string; sessionManagerAddress: string; } | null`

---

### initializeApp

`import { initializeApp } from "@msquared/etherbase-client"`

**Parameters:**

- `userConfig`: `EtherbaseConfig`

**Returns:** `void`

---

### initializeConnection

`import { initializeConnection } from "@msquared/etherbase-client"`

**Parameters:**

- `address`: ``0x${string}``
- `siteName`: `string`
- `signTypedData`: `SignTypedDataFunction`

**Returns:** `Promise<boolean>`

---

### setPreferredWallet

`import { setPreferredWallet } from "@msquared/etherbase-client"`

**Parameters:**

- `address`: ``0x${string}``

**Returns:** `void`

---

