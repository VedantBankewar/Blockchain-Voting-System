// All wallet logic lives in WalletContext so the state is shared across every component.
// This re-export keeps existing imports working without changes.
export { useWallet } from '@/contexts/WalletContext'
