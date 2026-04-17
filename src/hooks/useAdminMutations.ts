import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContract } from './useContract'
import { useWallet } from './useWallet'
import { queryKeys } from './useQueries'

export function useCreateElection() {
  const queryClient = useQueryClient()
  const { signer, provider } = useWallet()
  const { createElection } = useContract(signer, provider)

  return useMutation({
    mutationFn: async (params: {
      name: string
      description: string
      startTime: number
      endTime: number
    }) => {
      if (!signer) throw new Error('Wallet not connected')
      return createElection(params.name, params.description, params.startTime, params.endTime)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.electionCount })
    },
  })
}

export function useAddCandidate() {
  const queryClient = useQueryClient()
  const { signer, provider } = useWallet()
  const { addCandidate } = useContract(signer, provider)

  return useMutation({
    mutationFn: async (params: { electionId: number; name: string; party: string }) => {
      if (!signer) throw new Error('Wallet not connected')
      return addCandidate(params.electionId, params.name, params.party)
    },
    onSuccess: (_result, { electionId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidates(electionId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.election(electionId) })
    },
  })
}

export function useRegisterVoter() {
  const queryClient = useQueryClient()
  const { signer, provider } = useWallet()
  const { registerVoter } = useContract(signer, provider)

  return useMutation({
    mutationFn: async (voterAddress: string) => {
      if (!signer) throw new Error('Wallet not connected')
      return registerVoter(voterAddress)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voterList'] })
    },
  })
}
