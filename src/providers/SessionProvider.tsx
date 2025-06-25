import React, { useCallback } from "react"
import {
  type ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
  useMemo,
} from "react"
import {
  PrivyProvider,
  usePrivy,
  useWallets,
  getEmbeddedConnectedWallet,
  useGuestAccounts,
  useUser,
  useCrossAppAccounts,
  useSignTypedData,
} from "@privy-io/react-auth"
import type { PrivyInterface } from "@privy-io/react-auth"
import {
  getPreferredWallet,
  LoginState,
  setPreferredWallet,
  SignTypedDataParams,
  useLogin,
} from "@msquared/etherbase-client"
import { createWalletClient, custom, type Address } from "viem"

// Define event types for EIP1193Provider
type EIP1193EventMap = {
  accountsChanged: (accounts: string[]) => void
  chainChanged: (chainId: string) => void
  connect: (info: { chainId: string }) => void
  disconnect: () => void
}

// Define the request function type
type EIP1193RequestFn = (args: {
  method: string
  params?: unknown[]
}) => Promise<unknown>

// Define a properly typed EIP1193Provider
interface EIP1193Provider {
  on: <E extends keyof EIP1193EventMap>(
    event: E,
    listener: EIP1193EventMap[E],
  ) => void
  removeListener: <E extends keyof EIP1193EventMap>(
    event: E,
    listener: EIP1193EventMap[E],
  ) => void
  request: EIP1193RequestFn
}

// Extend ConnectedWallet to include provider and required methods
interface ExtendedConnectedWallet {
  address: string
  provider?: EIP1193Provider
  getEthereumProvider: () => Promise<EIP1193Provider>
  // Add other properties as needed
}

type SessionContextType = {
  privy: PrivyInterface
  ethereumWallet: EIP1193Provider | null
  walletAddress: Address | null
  authenticated: boolean
  ready: boolean
  readyNoAuth: boolean
  loggedIn: boolean
  loginState: LoginState
  login: () => void
  loginAsGuest: () => void
  logout: () => void
  cancelLogin: () => void
  error: string | null
}

const SessionContext = createContext<SessionContextType>({
  privy: {} as PrivyInterface,
  ethereumWallet: null,
  walletAddress: null,
  authenticated: false,
  ready: false,
  readyNoAuth: false,
  loggedIn: false,
  loginState: LoginState.NONE,
  login: async () => {},
  loginAsGuest: async () => {},
  logout: async () => {},
  cancelLogin: async () => {},
  error: null,
})

export const dreamChain = {
  id: 50312,
  name: "Somnia Testnet",
  network: "somnia-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "STT",
    symbol: "STT",
  },
  rpcUrls: {
    default: { http: ["https://dream-rpc.somnia.network/"] },
    public: { http: ["https://dream-rpc.somnia.network/"] },
  },
}

export const useSession = () => useContext(SessionContext)

function SessionProviderInner({ children }: { children: ReactNode }) {
  const privy = usePrivy()
  const { wallets, ready: walletsReady } = useWallets()
  const embeddedWallet = getEmbeddedConnectedWallet(
    wallets,
  ) as ExtendedConnectedWallet | null
  console.log(
    "wallets",
    wallets,
    "embeddedWallet",
    embeddedWallet,
    "user has embedded wallet",
    privy.user?.wallet?.connectorType === "embedded",
  )

  // Get the preferred wallet from localStorage if it exists
  const preferredWalletAddress = getPreferredWallet()
  const preferredWallet = preferredWalletAddress
    ? (wallets.find(
        (w) => w.address === preferredWalletAddress,
      ) as ExtendedConnectedWallet)
    : undefined

  // Use preferred wallet if set, otherwise fall back to default logic
  const wallet = useMemo(
    () =>
      preferredWallet ||
      (wallets[0] as ExtendedConnectedWallet) ||
      embeddedWallet,
    [preferredWallet, wallets, embeddedWallet],
  )

  console.log("wallet", wallet, "preferredWallet", preferredWallet)

  const userHasEmbeddedWallet = privy.user?.wallet?.connectorType === "embedded"
  const [ethereumWallet, setEthereumWallet] = useState<EIP1193Provider | null>(
    null,
  )
  const walletAddress = useMemo(() => wallet?.address as Address, [wallet])
  const [walletLoading, setWalletLoading] = useState(false)
  const [walletLoaded, setWalletLoaded] = useState(false)
  const { createGuestAccount } = useGuestAccounts()

  const { refreshUser } = useUser()

  // Listen for wallet selection changes
  useEffect(() => {
    const handleWalletSelected = async (
      event: CustomEvent<{ wallet: ExtendedConnectedWallet }>,
    ) => {
      const selectedWallet = event.detail.wallet
      if (!selectedWallet) return

      try {
        const provider = await selectedWallet.getEthereumProvider()
        setEthereumWallet(provider)
        setPreferredWallet(selectedWallet.address as Address)
      } catch (error) {
        console.error("Failed to get provider for selected wallet:", error)
        setEthereumWallet(null)
      }
    }

    window.addEventListener(
      "wallet-selected",
      // @ts-ignore
      handleWalletSelected as EventListener,
    )
    return () => {
      window.removeEventListener(
        "wallet-selected",
        // @ts-ignore
        handleWalletSelected as EventListener,
      )
    }
  }, [])

  useEffect(() => {
    const setupProvider = async () => {
      if (!wallet) {
        setEthereumWallet(null)
        return
      }

      try {
        const provider = await wallet.getEthereumProvider()
        setEthereumWallet(provider)
        setWalletLoaded(true)
      } catch (error) {
        console.error("Failed to get Ethereum provider:", error)
        setEthereumWallet(null)
      }
    }

    setupProvider()
  }, [wallet])

  const loginCallbacks = useMemo(
    () => ({
      privyLogin: async () => {
        privy.login()
        refreshUser()
      },
      privyLoginAsGuest: async () => {
        await createGuestAccount()
      },
      privyLogout: privy.logout,
      privyGetWallets: async () => wallets.map((w) => w.address as Address),
      privyGetEmbeddedWallet: async () => embeddedWallet?.address as Address,
    }),
    [
      privy.login,
      privy.logout,
      createGuestAccount,
      wallets,
      embeddedWallet,
      refreshUser,
    ],
  )

  const authenticated = privy.authenticated

  console.log("privy.ready", privy.ready)
  console.log("privy.user", privy.user)
  console.log("walletsReady", walletsReady)
  console.log("ethereumWallet", ethereumWallet)
  console.log("embeddedWallet", embeddedWallet)
  console.log("walletLoaded", walletLoaded)

  const readyNoAuth = useMemo(() => {
    return (
      privy.ready &&
      (!privy.user ||
        (walletsReady &&
          (!userHasEmbeddedWallet || walletLoaded) &&
          (ethereumWallet || !embeddedWallet)))
    )
  }, [
    privy.ready,
    privy.user,
    walletsReady,
    ethereumWallet,
    embeddedWallet,
    walletLoaded,
    userHasEmbeddedWallet,
  ])

  const allReady = useMemo(() => {
    return readyNoAuth && authenticated
  }, [readyNoAuth, authenticated])

  console.log("allReady", allReady)

  const useGlobalWallet = false

  const { signTypedData: signTypedDataEmbedded } = useSignTypedData()
  const signTypedDataEmbeddedReal = useCallback(
    async (params: SignTypedDataParams) => {
      return (
        await signTypedDataEmbedded({
          domain: {
            name: params.domain.name,
            version: params.domain.version,
            chainId: Number(params.domain.chainId),
            verifyingContract: params.domain.verifyingContract,
          },
          // @ts-ignore
          types: params.types,
          // types: {
          //   EIP712Domain: [
          //     { name: "name", type: "string" },
          //     { name: "version", type: "string" },
          //     { name: "chainId", type: "uint256" },
          //     { name: "verifyingContract", type: "address" },
          //   ],
          //   Session: [
          //     { name: "message", type: "string" },
          //     { name: "nonce", type: "uint256" },
          //     { name: "user", type: "address" },
          //     { name: "value", type: "uint256" },
          //   ],
          // },
          primaryType: params.primaryType,
          message: params.message,
        })
      ).signature
    },
    [signTypedDataEmbedded],
  )
  const { signTypedData: signTypedDataCrossApp } = useCrossAppAccounts()
  const signTypedDataCrossAppReal = useCallback(
    async (params: SignTypedDataParams) => {
      return await signTypedDataCrossApp(
        {
          domain: {
            name: params.domain.name,
            version: params.domain.version,
            chainId: Number(params.domain.chainId),
            verifyingContract: params.domain.verifyingContract,
          },
          // @ts-ignore
          types: params.types,
          primaryType: params.primaryType,
          message: params.message,
        },
        {
          address: walletAddress,
        },
      )
    },
    [signTypedDataCrossApp, walletAddress],
  )

  const signTypedDataEOA = useCallback(
    async (params: SignTypedDataParams) => {
      const walletClient = createWalletClient({
        account: walletAddress,
        chain: dreamChain,
        transport: custom(window.ethereum),
      })
      console.log("signed eoa data", {
        domain: params.domain,
        types: params.types,
        primaryType: params.primaryType,
        message: params.message,
      })
      return await walletClient.signTypedData({
        domain: params.domain,
        types: params.types,
        primaryType: params.primaryType,
        message: params.message,
      })
    },
    [walletAddress],
  )

  const signTypedData = useMemo(() => {
    if (!wallet) return null
    const walletIsEmbedded = wallet.address === embeddedWallet?.address
    if (walletIsEmbedded) {
      if (useGlobalWallet) {
        return signTypedDataCrossAppReal
      }

      return signTypedDataEmbeddedReal
    }

    return signTypedDataEOA
  }, [
    signTypedDataEmbeddedReal,
    signTypedDataCrossAppReal,
    signTypedDataEOA,
    embeddedWallet,
    // useGlobalWallet,
    wallet,
  ])

  const providerIsReadyIfNeeded = useMemo(() => {
    return !!ethereumWallet || !embeddedWallet
  }, [ethereumWallet, embeddedWallet])

  const {
    loggedIn,
    loginState,
    error,
    login,
    loginAsGuest,
    logout,
    cancelLogin,
  } = useLogin({
    // @ts-ignore
    // customProvider: ethereumWallet,
    ...loginCallbacks,
    autoLogin: false,
    ready: walletsReady && !!privy.user && providerIsReadyIfNeeded,
    signTypedData,
  })

  // Handle auto login manually to avoid circular dependencies
  // useEffect(() => {
  //   if (transport && !loggedIn && loginState === LoginState.NONE) {
  //     login()
  //   }
  // }, [transport, loggedIn, loginState, login])

  // useEffect(() => {
  //   console.log("walletLoading", walletLoading)
  //   if (
  //     !embeddedWallet ||
  //     !walletsReady ||
  //     !privy.user ||
  //     walletLoading ||
  //     walletLoaded
  //   ) {
  //     return
  //   }

  //   let cancelled = false
  //   async function loadWallet() {
  //     setWalletLoading(true)
  //     try {
  //       const provider = await wallet?.getEthereumProvider()
  //       if (!cancelled && provider) {
  //         setEthereumWallet(provider)
  //         console.debug("Wallet loaded successfully:", embeddedWallet?.address)
  //         setWalletLoaded(true)
  //       }
  //     } catch (error) {
  //       console.error("Error setting wallet provider:", error)
  //       if (!cancelled) {
  //         setWalletLoaded(true)
  //       }
  //     } finally {
  //       if (!cancelled) {
  //         setWalletLoading(false)
  //       }
  //     }
  //   }

  //   loadWallet()
  //   return () => {
  //     cancelled = true
  //   }
  // }, [embeddedWallet, walletsReady, privy.user, walletLoaded, walletLoading])

  // Debug logging effect
  useEffect(() => {
    console.debug("Auth state:", {
      authenticated,
      privyReady: privy.ready,
      walletsReady,
      hasUser: !!privy.user,
      hasEmbeddedWallet: !!embeddedWallet,
      ethereumWallet,
      allReady,
    })
  }, [
    authenticated,
    privy.ready,
    walletsReady,
    privy.user,
    embeddedWallet,
    ethereumWallet,
    allReady,
  ])

  const value = useMemo(
    () => ({
      privy,
      ethereumWallet,
      walletAddress,
      authenticated: Boolean(ethereumWallet),
      ready: walletsReady && !walletLoading,
      readyNoAuth: walletsReady,
      loggedIn: loginState === LoginState.LOGGED_IN,
      loginState,
      login,
      loginAsGuest,
      logout,
      cancelLogin,
      error,
    }),
    [
      privy,
      ethereumWallet,
      walletAddress,
      walletsReady,
      walletLoading,
      loginState,
      login,
      loginAsGuest,
      logout,
      cancelLogin,
      error,
    ],
  )

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const PRIVY_APP_ID = "cm7t8jy0j034wwqt3e1vdzn08"

  if (!PRIVY_APP_ID) {
    throw new Error("PRIVY_APP_ID is not set")
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      clientId="client-WY5hB9Nis4TkP7XgePqGjXR8AWyFkcPMKFoWuSRMNH7N2"
      config={{
        loginMethodsAndOrder: {
          primary: [
            "twitter",
            "privy:cm8d9yzp2013kkr612h8ymoq8",
            "detected_ethereum_wallets",
            "wallet_connect",
          ],
        },
        embeddedWallets: {
          showWalletUIs: false,
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
        },
        defaultChain: {
          id: dreamChain.id,
          name: dreamChain.name,
          network: dreamChain.network,
          nativeCurrency: dreamChain.nativeCurrency,
          rpcUrls: {
            default: {
              http: [dreamChain.rpcUrls.default.http[0]],
            },
            public: {
              http: [dreamChain.rpcUrls.public.http[0]],
            },
          },
        },
        supportedChains: [
          {
            id: dreamChain.id,
            name: dreamChain.name,
            network: dreamChain.network,
            nativeCurrency: dreamChain.nativeCurrency,
            rpcUrls: {
              default: {
                http: [dreamChain.rpcUrls.default.http[0]],
              },
              public: {
                http: [dreamChain.rpcUrls.public.http[0]],
              },
            },
          },
        ],
      }}
    >
      <SessionProviderInner>{children}</SessionProviderInner>
    </PrivyProvider>
  )
}
