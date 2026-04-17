import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import type { WalletState } from '@/types'

declare global {
    interface Window {
        ethereum?: {
            isMetaMask?: boolean
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
            on: (event: string, callback: (...args: unknown[]) => void) => void
            removeListener: (event: string, callback: (...args: unknown[]) => void) => void
        }
    }
}

const SUPPORTED_CHAIN_IDS = [31337, 11155111] // Hardhat local, Sepolia

interface WalletContextValue extends WalletState {
    provider: BrowserProvider | null
    signer: JsonRpcSigner | null
    connect: () => Promise<void>
    disconnect: () => void
    isMetaMaskInstalled: boolean
}

const WalletContext = createContext<WalletContextValue | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<WalletState>({
        isConnected: false,
        address: null,
        chainId: null,
        isConnecting: false,
        error: null,
    })
    const [provider, setProvider] = useState<BrowserProvider | null>(null)
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null)

    const connect = useCallback(async () => {
        if (!window.ethereum) {
            setState(prev => ({ ...prev, error: 'Please install MetaMask to use this application' }))
            return
        }
        setState(prev => ({ ...prev, isConnecting: true, error: null }))
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
            const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string
            const chainIdNumber = parseInt(chainId, 16)

            if (!SUPPORTED_CHAIN_IDS.includes(chainIdNumber)) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x7A69' }],
                    })
                } catch (switchError: unknown) {
                    if ((switchError as { code: number }).code === 4902) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0x7A69',
                                chainName: 'Hardhat Local',
                                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                                rpcUrls: ['http://127.0.0.1:8545'],
                            }],
                        })
                    }
                }
            }

            const browserProvider = new BrowserProvider(window.ethereum)
            // Explicitly request signer for accounts[0] so it always matches the stored address,
            // even when MetaMask has a different account currently "active".
            const userSigner = await browserProvider.getSigner(accounts[0])
            setProvider(browserProvider)
            setSigner(userSigner)
            setState({ isConnected: true, address: accounts[0], chainId: chainIdNumber, isConnecting: false, error: null })
        } catch (error) {
            console.error('Error connecting wallet:', error)
            setState(prev => ({ ...prev, isConnecting: false, error: 'Failed to connect wallet' }))
        }
    }, [])

    const disconnect = useCallback(() => {
        setProvider(null)
        setSigner(null)
        setState({ isConnected: false, address: null, chainId: null, isConnecting: false, error: null })
    }, [])

    // Auto-detect existing MetaMask connection on mount
    useEffect(() => {
        let mounted = true
        const initWallet = async () => {
            if (!window.ethereum) {
                if (mounted) setState(prev => ({ ...prev, error: 'MetaMask is not installed' }))
                return
            }
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[]
                if (accounts.length > 0 && mounted) {
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string
                    const chainIdNumber = parseInt(chainId, 16)
                    const browserProvider = new BrowserProvider(window.ethereum)
                    // Explicitly bind signer to accounts[0] — avoids mismatch when MetaMask
                    // has a different account selected as "active".
                    const userSigner = await browserProvider.getSigner(accounts[0])
                    setProvider(browserProvider)
                    setSigner(userSigner)
                    setState({ isConnected: true, address: accounts[0], chainId: chainIdNumber, isConnecting: false, error: null })
                }
            } catch (error) {
                console.error('Error checking wallet connection:', error)
            }
        }
        initWallet()
        return () => { mounted = false }
    }, [])

    // Listen for account / chain changes
    useEffect(() => {
        if (!window.ethereum) return
        const handleAccountsChanged = (accounts: unknown) => {
            const arr = accounts as string[]
            if (arr.length === 0) {
                disconnect()
            } else {
                // Update address AND refresh signer for the new account
                setState(prev => ({ ...prev, address: arr[0] }))
                if (provider) {
                    provider.getSigner(arr[0])
                        .then(newSigner => setSigner(newSigner))
                        .catch(console.error)
                }
            }
        }
        const handleChainChanged = (chainId: unknown) => {
            setState(prev => ({ ...prev, chainId: parseInt(chainId as string, 16) }))
            window.location.reload()
        }
        window.ethereum.on('accountsChanged', handleAccountsChanged)
        window.ethereum.on('chainChanged', handleChainChanged)
        return () => {
            window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
            window.ethereum?.removeListener('chainChanged', handleChainChanged)
        }
    }, [disconnect])

    return (
        <WalletContext.Provider value={{
            ...state,
            provider,
            signer,
            connect,
            disconnect,
            isMetaMaskInstalled: typeof window !== 'undefined' && !!window.ethereum?.isMetaMask,
        }}>
            {children}
        </WalletContext.Provider>
    )
}

export function useWallet() {
    const ctx = useContext(WalletContext)
    if (!ctx) throw new Error('useWallet must be used within WalletProvider')
    return ctx
}
