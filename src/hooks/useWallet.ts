import { useState, useEffect, useCallback } from 'react'
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

export function useWallet() {
    const [state, setState] = useState<WalletState>({
        isConnected: false,
        address: null,
        chainId: null,
        isConnecting: false,
        error: null,
    })

    const [provider, setProvider] = useState<BrowserProvider | null>(null)
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null)

    const checkIfWalletIsConnected = useCallback(async () => {
        if (!window.ethereum) {
            setState(prev => ({ ...prev, error: 'MetaMask is not installed' }))
            return
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[]

            if (accounts.length > 0) {
                const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string
                const chainIdNumber = parseInt(chainId, 16)

                const browserProvider = new BrowserProvider(window.ethereum)
                const userSigner = await browserProvider.getSigner()

                setProvider(browserProvider)
                setSigner(userSigner)

                setState({
                    isConnected: true,
                    address: accounts[0],
                    chainId: chainIdNumber,
                    isConnecting: false,
                    error: null,
                })
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error)
        }
    }, [])

    const connect = useCallback(async () => {
        if (!window.ethereum) {
            setState(prev => ({ ...prev, error: 'Please install MetaMask to use this application' }))
            return
        }

        setState(prev => ({ ...prev, isConnecting: true, error: null }))

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            }) as string[]

            const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string
            const chainIdNumber = parseInt(chainId, 16)

            if (!SUPPORTED_CHAIN_IDS.includes(chainIdNumber)) {
                // Try to switch to Hardhat local network
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x7A69' }], // 31337 in hex
                    })
                } catch (switchError: unknown) {
                    // If the network doesn't exist, add it
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
            const userSigner = await browserProvider.getSigner()

            setProvider(browserProvider)
            setSigner(userSigner)

            setState({
                isConnected: true,
                address: accounts[0],
                chainId: chainIdNumber,
                isConnecting: false,
                error: null,
            })
        } catch (error) {
            console.error('Error connecting wallet:', error)
            setState(prev => ({
                ...prev,
                isConnecting: false,
                error: 'Failed to connect wallet',
            }))
        }
    }, [])

    const disconnect = useCallback(() => {
        setProvider(null)
        setSigner(null)
        setState({
            isConnected: false,
            address: null,
            chainId: null,
            isConnecting: false,
            error: null,
        })
    }, [])

    useEffect(() => {
        checkIfWalletIsConnected()
    }, [checkIfWalletIsConnected])

    useEffect(() => {
        if (!window.ethereum) return

        const handleAccountsChanged = (accounts: unknown) => {
            const accountsArray = accounts as string[]
            if (accountsArray.length === 0) {
                disconnect()
            } else {
                setState(prev => ({ ...prev, address: accountsArray[0] }))
            }
        }

        const handleChainChanged = (chainId: unknown) => {
            const chainIdNumber = parseInt(chainId as string, 16)
            setState(prev => ({ ...prev, chainId: chainIdNumber }))
            window.location.reload()
        }

        window.ethereum.on('accountsChanged', handleAccountsChanged)
        window.ethereum.on('chainChanged', handleChainChanged)

        return () => {
            window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
            window.ethereum?.removeListener('chainChanged', handleChainChanged)
        }
    }, [disconnect])

    return {
        ...state,
        provider,
        signer,
        connect,
        disconnect,
        isMetaMaskInstalled: typeof window !== 'undefined' && !!window.ethereum?.isMetaMask,
    }
}
