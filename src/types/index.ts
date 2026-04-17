export interface User {
    id: string
    email: string
    walletAddress?: string
    isVerified: boolean
    isAdmin: boolean
    createdAt: string
}

export interface Election {
    id: string
    name: string
    description: string
    startDate: string
    endDate: string
    status: 'upcoming' | 'active' | 'completed'
    electionCode: string
    contractAddress?: string
    createdAt: string
}

export interface Candidate {
    id: string
    electionId: string
    name: string
    party: string
    imageUrl?: string
    voteCount: number
}

export interface Vote {
    id: string
    voterId: string
    electionId: string
    candidateId: string
    txHash: string
    votedAt: string
}

export interface WalletState {
    isConnected: boolean
    address: string | null
    chainId: number | null
    isConnecting: boolean
    error: string | null
}

export interface ElectionResults {
    electionId: string
    totalVotes: number
    candidates: {
        candidateId: string
        name: string
        party: string
        votes: number
        percentage: number
    }[]
}

export interface TransactionStatus {
    status: 'pending' | 'confirmed' | 'failed'
    hash?: string
    error?: string
}
