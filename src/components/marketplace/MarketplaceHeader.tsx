import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { useSession as useSessionProvider } from "@/providers/SessionProvider"
import { useSession } from "@msquared/etherbase-client"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { AnimatedButton } from "../ui/animated-button"
import { useTransactionToast } from "@/hooks/useTransactionToast"
import { formatNumber } from "@/lib/utils"

interface MarketplaceHeaderProps {
  title?: string
  showBackToMarketplace?: boolean
}

export function MarketplaceHeader({ 
  title = "chunked marketplace", 
  showBackToMarketplace = false 
}: MarketplaceHeaderProps) {
  const { walletAddress, logout, ethereumWallet } = useSessionProvider()
  const { executeBooleanTransaction } = useTransactionToast()
  
  // Session balance state
  const [sessionBalance, setSessionBalance] = useState<bigint | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  
  // Wallet balance state
  const [walletBalance, setWalletBalance] = useState<bigint | null>(null)
  const [isLoadingWalletBalance, setIsLoadingWalletBalance] = useState(false)
  
  // Dialog states
  const [depositDialogOpen, setDepositDialogOpen] = useState(false)
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
  
  // Form states
  const [depositAmount, setDepositAmount] = useState("0.01")
  const [withdrawAmount, setWithdrawAmount] = useState("0.01")

  // Use the etherbase session hook
  const { 
    refreshSession, 
    topUpSession, 
    withdrawFromSession,
    getSessionBalance
  } = useSession()

  // Check if window.ethereum is available
  const hasExternalWallet = typeof window !== 'undefined' && window.ethereum

  const loadSessionBalance = useCallback(async () => {
    if (!walletAddress) return
    
    setIsLoadingBalance(true)
    try {
      const balance = await getSessionBalance()
      setSessionBalance(balance)
    } catch (error) {
      console.error("Failed to load session balance:", error)
    } finally {
      setIsLoadingBalance(false)
    }
  }, [walletAddress, getSessionBalance])

  const loadWalletBalance = useCallback(async () => {
    if (!walletAddress || !ethereumWallet) return
    
    setIsLoadingWalletBalance(true)
    try {
      const balance = await ethereumWallet.request({
        method: 'eth_getBalance',
        params: [walletAddress, 'latest']
      }) as string
      setWalletBalance(BigInt(balance))
    } catch (error) {
      console.error("Failed to load wallet balance:", error)
    } finally {
      setIsLoadingWalletBalance(false)
    }
  }, [walletAddress, ethereumWallet])

  // Load session balance on mount and when wallet changes
  useEffect(() => {
    if (walletAddress) {
      loadSessionBalance()
    }
  }, [walletAddress, loadSessionBalance])

  // Load wallet balance on mount and when wallet changes
  useEffect(() => {
    if (walletAddress && ethereumWallet) {
      loadWalletBalance()
    }
  }, [walletAddress, ethereumWallet, loadWalletBalance])

  // Load wallet balance when deposit dialog opens
  useEffect(() => {
    if (depositDialogOpen && walletAddress && ethereumWallet) {
      loadWalletBalance()
    }
  }, [depositDialogOpen, walletAddress, ethereumWallet, loadWalletBalance])

  const handleDeposit = async () => {
    if (!depositAmount || !walletAddress || !hasExternalWallet) return

    const amountInWei = BigInt(Math.floor(Number(depositAmount) * 1e18))
    
    const success = await executeBooleanTransaction(
      () => topUpSession(amountInWei),
      {
        successTitle: 'Deposit successful!',
        successMessage: `Added ${formatNumber(Number(depositAmount))} STT to your session`,
        errorTitle: 'Deposit failed',
        errorMessage: 'Please try again or check your wallet connection'
      }
    )
    
    if (success) {
      // Refresh balances after successful deposit
      await loadSessionBalance()
      await loadWalletBalance()
      await refreshSession()
      
      // Reset and close
      setDepositAmount("0.01")
      setDepositDialogOpen(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || !walletAddress) return

    const amountInWei = BigInt(Math.floor(Number(withdrawAmount) * 1e18))
    
    const success = await executeBooleanTransaction(
      () => withdrawFromSession(amountInWei),
      {
        successTitle: 'Withdrawal successful!',
        successMessage: `Withdrew ${formatNumber(Number(withdrawAmount))} STT from your session`,
        errorTitle: 'Withdrawal failed',
        errorMessage: 'Please check your session balance and try again'
      }
    )
    
    if (success) {
      // Refresh balances after successful withdrawal
      await loadSessionBalance()
      await loadWalletBalance()
      await refreshSession()
      
      // Reset and close
      setWithdrawAmount("0.01")
      setWithdrawDialogOpen(false)
    }
  }

  const isValidDeposit = depositAmount && 
    Number(depositAmount) > 0 && 
    walletAddress && 
    hasExternalWallet &&
    walletBalance &&
    BigInt(Math.floor(Number(depositAmount) * 1e18)) <= walletBalance

  const isValidWithdraw = withdrawAmount && 
    Number(withdrawAmount) > 0 && 
    walletAddress &&
    sessionBalance &&
    BigInt(Math.floor(Number(withdrawAmount) * 1e18)) <= sessionBalance

  return (
    <>
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Title and navigation */}
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-foreground">
                {title}
              </h1>
              
              {/* Home Link */}
              <Link to="/">
                <Button variant="outline" size="sm">
                  home
                </Button>
              </Link>
              
              {showBackToMarketplace && (
                <Link to="/marketplace">
                  <Button variant="outline" size="sm">
                    ← marketplace
                  </Button>
                </Link>
              )}
            </div>
            
            {/* Right side - User controls */}
            <div className="flex items-center gap-3">
              {walletAddress ? (
                <>
                  {/* Session Balance */}
                  <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/20 px-3 py-1.5 rounded-full border border-purple-200 dark:border-purple-800">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      {isLoadingBalance ? (
                        "loading..."
                      ) : sessionBalance !== null ? (
                        `${formatNumber(Number(sessionBalance) / 1e18)} STT`
                      ) : (
                        "error"
                      )}
                    </span>
                    
                    {/* Session Balance Actions */}
                    <div className="flex gap-1 ml-1">
                      <Button
                        onClick={loadSessionBalance}
                        disabled={isLoadingBalance}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Refresh balance">
                          <title>Refresh balance</title>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </Button>
                      
                      <Button
                        onClick={() => setDepositDialogOpen(true)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                        disabled={!hasExternalWallet}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Deposit funds">
                          <title>Deposit funds</title>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </Button>
                      
                      <Button
                        onClick={() => setWithdrawDialogOpen(true)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Withdraw funds">
                          <title>Withdraw funds</title>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                  
                  {/* User Address */}
                  <span className="text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                  
                  {/* Inventory */}
                  <Link to="/marketplace/inventory">
                    <Button variant="outline" size="sm">
                      inventory
                    </Button>
                  </Link>
                  
                  {/* Logout */}
                  <Button variant="outline" size="sm" onClick={logout}>
                    logout
                  </Button>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  not connected
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Dialog */}
      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit to Session</DialogTitle>
          </DialogHeader>
          
          {hasExternalWallet ? (
            <div className="space-y-4">
              {/* Current Wallet Balance */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700 dark:text-blue-300">wallet balance</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-900 dark:text-blue-100">
                      {isLoadingWalletBalance ? (
                        "loading..."
                      ) : walletBalance !== null ? (
                        `${formatNumber(Number(walletBalance) / 1e18)} STT`
                      ) : (
                        "error"
                      )}
                    </span>
                    <Button
                      onClick={loadWalletBalance}
                      disabled={isLoadingWalletBalance}
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                      aria-label="Refresh wallet balance"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <title>Refresh</title>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="deposit-amount" className="text-sm font-medium mb-2 block">
                  Amount (STT)
                </label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  step="0.001"
                  min="0"
                  max={walletBalance ? formatNumber(Number(walletBalance) / 1e18) : undefined}
                />
              </div>

              {depositAmount && Number(depositAmount) > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">deposit amount</span>
                    <span className="font-semibold">
                      {formatNumber(Number(depositAmount))} STT
                    </span>
                  </div>
                </div>
              )}

              {/* Insufficient balance warning */}
              {walletBalance && depositAmount && Number(depositAmount) > 0 && 
               BigInt(Math.floor(Number(depositAmount) * 1e18)) > walletBalance && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Insufficient wallet balance for deposit
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setDepositDialogOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <AnimatedButton
                  onClick={handleDeposit}
                  disabled={!isValidDeposit || 
                    Boolean(walletBalance && depositAmount && 
                     BigInt(Math.floor(Number(depositAmount) * 1e18)) > walletBalance)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  loadingText="depositing..."
                  successText="deposited!"
                >
                  deposit
                </AnimatedButton>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 text-red-600">⚠️</div>
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                External wallet required
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Install MetaMask or another web3 wallet to deposit funds
              </p>
              <Button
                onClick={() => setDepositDialogOpen(false)}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw from Session</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="withdraw-amount" className="text-sm font-medium mb-2 block">
                Amount (STT)
              </label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0.01"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                step="0.001"
                min="0"
                max={sessionBalance ? formatNumber(Number(sessionBalance) / 1e18) : undefined}
              />
            </div>

            {withdrawAmount && Number(withdrawAmount) > 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">withdraw amount</span>
                  <span className="font-semibold">
                    {formatNumber(Number(withdrawAmount))} STT
                  </span>
                </div>
              </div>
            )}

            {sessionBalance && BigInt(Math.floor(Number(withdrawAmount) * 1e18)) > sessionBalance && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">
                  Insufficient balance for withdrawal
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => setWithdrawDialogOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <AnimatedButton
                onClick={handleWithdraw}
                disabled={!isValidWithdraw}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                loadingText="withdrawing..."
                successText="withdrawn!"
              >
                withdraw
              </AnimatedButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 