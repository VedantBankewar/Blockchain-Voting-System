import { useQuery } from '@tanstack/react-query'
import { useContract } from './useContract'
import { useWallet } from './useWallet'

export const queryKeys = {
  election: (id: number) => ['election', id] as const,
  candidates: (electionId: number) => ['candidates', electionId] as const,
  electionCount: ['electionCount'] as const,
  voterStatus: (address: string) => ['voterStatus', address] as const,
  hasVoted: (electionId: number, address: string) => ['hasVoted', electionId, address] as const,
  isAdmin: (address: string) => ['isAdmin', address] as const,
  electionsList: ['electionsList'] as const,
}

// useElection - fetch single election
export function useElection(electionId: number | null) {
  const { signer, provider } = useWallet()
  const { getElection } = useContract(signer, provider)

  return useQuery({
    queryKey: queryKeys.election(electionId!),
    queryFn: () => getElection(electionId!),
    enabled: electionId !== null && electionId > 0 && !!provider,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}

// useCandidates - fetch candidates for election
export function useCandidates(electionId: number | null) {
  const { signer, provider } = useWallet()
  const { getCandidates } = useContract(signer, provider)

  return useQuery({
    queryKey: queryKeys.candidates(electionId!),
    queryFn: () => getCandidates(electionId!),
    enabled: electionId !== null && electionId > 0 && !!provider,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}

// useElectionCount - total elections
export function useElectionCount() {
  const { signer, provider } = useWallet()
  const { contract, readContract } = useContract(signer, provider)

  return useQuery({
    queryKey: queryKeys.electionCount,
    queryFn: async () => {
      const c = readContract || contract
      if (!c) return 0
      return Number(await c.electionCount())
    },
    enabled: !!provider,
    staleTime: 60_000,
  })
}

// useVoterStatus - check if address is registered
export function useVoterStatus(address: string | null) {
  const { signer, provider } = useWallet()
  const { isRegisteredVoter } = useContract(signer, provider)

  return useQuery({
    queryKey: queryKeys.voterStatus(address || ''),
    queryFn: () => isRegisteredVoter(address!),
    enabled: !!provider && !!address,
    staleTime: 10 * 60_000,
  })
}

// useHasVoted - check if voter has voted
export function useHasVoted(electionId: number | null, address: string | null) {
  const { signer, provider } = useWallet()
  const { hasVoted } = useContract(signer, provider)

  return useQuery({
    queryKey: queryKeys.hasVoted(electionId!, address || ''),
    queryFn: () => hasVoted(electionId!, address!),
    enabled: electionId !== null && electionId > 0 && !!provider && !!address,
    staleTime: 5 * 60_000,
  })
}

// useAdminVerify - check if address is admin
export function useAdminVerify(address: string | null) {
  const { signer, provider } = useWallet()
  const { isAdmin } = useContract(signer, provider)

  return useQuery({
    queryKey: queryKeys.isAdmin(address || ''),
    queryFn: () => isAdmin(address!),
    enabled: !!provider && !!address && address.length === 42,
    staleTime: 10 * 60_000,
  })
}

// useElections - fetch all elections
export function useElections() {
  const { signer, provider } = useWallet()
  const { contract, readContract } = useContract(signer, provider)

  return useQuery({
    queryKey: queryKeys.electionsList,
    queryFn: async () => {
      const c = readContract || contract
      if (!c) return []

      const count = Number(await c.electionCount())
      if (count === 0) return []

      const elections = []
      for (let i = 1; i <= count; i++) {
        const election = await c.getElection(i)
        if (election && election[1]) { // election name exists
          elections.push({
            id: i,
            name: election[1],
            description: election[2],
            startTime: Number(election[3]),
            endTime: Number(election[4]),
            isActive: election[5],
            totalVotes: Number(election[6]),
            candidateCount: Number(election[7]),
          })
        }
      }
      return elections
    },
    enabled: !!provider,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}
