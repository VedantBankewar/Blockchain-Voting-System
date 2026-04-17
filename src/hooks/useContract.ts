import { useState, useCallback, useMemo } from 'react'
import { Contract, JsonRpcSigner, BrowserProvider } from 'ethers'
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from '@/lib/ethereum'

interface ElectionData {
    id: number
    name: string
    description: string
    startTime: number
    endTime: number
    isActive: boolean
    totalVotes: number
    candidateCount: number
}

interface CandidateData {
    id: number
    name: string
    party: string
    voteCount: number
    isActive: boolean
}

export function useContract(signer: JsonRpcSigner | null, provider: BrowserProvider | null) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const contract = useMemo(() => {
        if (!signer) return null
        return new Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer)
    }, [signer])

    const readContract = useMemo(() => {
        if (!provider) return null
        return new Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, provider)
    }, [provider])

    // Admin Functions
    const createElection = useCallback(async (
        name: string,
        description: string,
        startTime: number,
        endTime: number
    ) => {
        if (!contract) throw new Error('Wallet not connected')

        setIsLoading(true)
        setError(null)

        try {
            const tx = await contract.createElection(name, description, startTime, endTime)
            const receipt = await tx.wait()

            // Get election ID from event
            const event = receipt.logs.find(
                (log: { fragment?: { name: string } }) => log.fragment?.name === 'ElectionCreated'
            )
            const electionId = event?.args?.[0]

            return { txHash: receipt.hash, electionId: Number(electionId) }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create election'
            setError(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [contract])

    const addCandidate = useCallback(async (
        electionId: number,
        name: string,
        party: string
    ) => {
        if (!contract) throw new Error('Wallet not connected')

        setIsLoading(true)
        setError(null)

        try {
            const tx = await contract.addCandidate(electionId, name, party)
            const receipt = await tx.wait()
            return { txHash: receipt.hash }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add candidate'
            setError(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [contract])

    const registerVoter = useCallback(async (voterAddress: string) => {
        if (!contract) throw new Error('Wallet not connected')

        setIsLoading(true)
        setError(null)

        try {
            const tx = await contract.registerVoter(voterAddress)
            const receipt = await tx.wait()
            return { txHash: receipt.hash }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to register voter'
            setError(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [contract])

    // Voting Functions
    const castVote = useCallback(async (electionId: number, candidateId: number) => {
        if (!contract) throw new Error('Wallet not connected')

        setIsLoading(true)
        setError(null)

        try {
            const tx = await contract.castVote(electionId, candidateId)
            const receipt = await tx.wait()

            // Get vote hash from event
            const event = receipt.logs.find(
                (log: { fragment?: { name: string } }) => log.fragment?.name === 'VoteCast'
            )
            const voteHash = event?.args?.[3]

            return { txHash: receipt.hash, voteHash }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to cast vote'
            setError(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [contract])

    // Read Functions
    const getElection = useCallback(async (electionId: number): Promise<ElectionData | null> => {
        const contractToUse = readContract || contract
        if (!contractToUse) return null

        try {
            const result = await contractToUse.getElection(electionId)
            return {
                id: Number(result[0]),
                name: result[1],
                description: result[2],
                startTime: Number(result[3]),
                endTime: Number(result[4]),
                isActive: result[5],
                totalVotes: Number(result[6]),
                candidateCount: Number(result[7]),
            }
        } catch (err) {
            console.error('Error getting election:', err)
            return null
        }
    }, [contract, readContract])

    const getCandidates = useCallback(async (electionId: number): Promise<CandidateData[]> => {
        const contractToUse = readContract || contract
        if (!contractToUse) return []

        try {
            const result = await contractToUse.getAllCandidates(electionId)
            return result.map((c: { id: bigint; name: string; party: string; voteCount: bigint; isActive: boolean }) => ({
                id: Number(c.id),
                name: c.name,
                party: c.party,
                voteCount: Number(c.voteCount),
                isActive: c.isActive,
            }))
        } catch (err) {
            console.error('Error getting candidates:', err)
            return []
        }
    }, [contract, readContract])

    const hasVoted = useCallback(async (electionId: number, voterAddress: string): Promise<boolean> => {
        const contractToUse = readContract || contract
        if (!contractToUse) return false

        try {
            return await contractToUse.checkVoted(electionId, voterAddress)
        } catch (err) {
            console.error('Error checking vote status:', err)
            return false
        }
    }, [contract, readContract])

    const isRegisteredVoter = useCallback(async (address: string): Promise<boolean> => {
        const contractToUse = readContract || contract
        if (!contractToUse) return false

        try {
            return await contractToUse.isRegisteredVoter(address)
        } catch (err) {
            console.error('Error checking voter registration:', err)
            return false
        }
    }, [contract, readContract])

    const isAdmin = useCallback(async (address: string): Promise<boolean> => {
        const contractToUse = readContract || contract
        if (!contractToUse) return false

        try {
            return await contractToUse.isAdmin(address)
        } catch (err) {
            console.error('Error checking admin status:', err)
            return false
        }
    }, [contract, readContract])

    const getVoteReceipt = useCallback(async (electionId: number, voterAddress: string) => {
        const contractToUse = readContract || contract
        if (!contractToUse) return null

        try {
            const result = await contractToUse.getVoteReceipt(electionId, voterAddress)
            return {
                electionId: Number(result[0]),
                candidateId: Number(result[1]),
                timestamp: Number(result[2]),
                voteHash: result[3],
            }
        } catch (err) {
            console.error('Error getting vote receipt:', err)
            return null
        }
    }, [contract, readContract])

    return {
        contract,
        readContract,
        isLoading,
        error,
        // Admin functions
        createElection,
        addCandidate,
        registerVoter,
        // Voting functions
        castVote,
        // Read functions
        getElection,
        getCandidates,
        hasVoted,
        isRegisteredVoter,
        isAdmin,
        getVoteReceipt,
    }
}
