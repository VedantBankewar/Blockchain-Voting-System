import { useState } from 'react'
import {
    Users,
    Plus,
    Search,
    Filter,
    CheckCircle,
    MoreVertical,
    Eye,
    Trash2,
    UserCheck,
    Clock,
    Loader2,
    AlertCircle,
    X,
} from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { useRegisterVoter } from '@/hooks/useAdminMutations'
import { db } from '@/integrations/supabase/client'
import { formatAddress, formatDateTime } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

interface Voter {
    id: string
    walletAddress: string
    isVerified: boolean
    registeredAt: string
    votesCount: number
}

export function AdminVoters() {
    useWallet() // Keep wallet connection active
    const registerVoterMutation = useRegisterVoter()

    const [showAddModal, setShowAddModal] = useState(false)
    const [newVoterAddress, setNewVoterAddress] = useState('')
    const [showDropdown, setShowDropdown] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Fetch voters from Supabase
    const { data: votersData, refetch: refetchVoters } = useQuery({
        queryKey: ['votersList'],
        queryFn: async () => {
            const { data, error } = await db.voters.getAll()
            if (error) throw error
            return data || []
        },
        staleTime: 60000,
    })

    const voters: Voter[] = (votersData || []).map((v) => ({
        id: v.id,
        walletAddress: v.wallet_address || '',
        isVerified: v.is_verified || false,
        registeredAt: v.created_at || new Date().toISOString(),
        votesCount: 0,
    }))

    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const filteredVoters = voters.filter(voter => {
        const matchesSearch = voter.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'verified' && voter.isVerified) ||
            (statusFilter === 'pending' && !voter.isVerified)
        return matchesSearch && matchesStatus
    })

    const verifiedCount = voters.filter(v => v.isVerified).length
    const pendingCount = voters.filter(v => !v.isVerified).length

    const handleAddVoter = async () => {
        if (!newVoterAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
            setError('Please enter a valid Ethereum address (0x…)')
            return
        }
        setError(null)
        setSuccess(null)

        try {
            // Register on blockchain (primary action)
            await registerVoterMutation.mutateAsync(newVoterAddress)
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Transaction failed'
            const match = msg.match(/reason="([^"]+)"/) || msg.match(/revert: (.+)/)
            setError(match ? match[1] : msg)
            return
        }

        // Best-effort Supabase sync — does not block success
        try {
            const { data: existing } = await db.voters.getByWallet(newVoterAddress)
            if (!existing) {
                await db.voters.create({ wallet_address: newVoterAddress, is_verified: true })
            } else {
                await db.voters.verify(existing.id)
            }
            refetchVoters()
        } catch {
            // Supabase not configured — blockchain registration still succeeded
        }

        setSuccess(`${newVoterAddress} registered successfully on blockchain.`)
        setNewVoterAddress('')
    }

    const handleVerify = async (voterId: string) => {
        try {
            await db.voters.verify(voterId)
            refetchVoters()
        } catch (err) {
            console.error('Failed to verify voter:', err)
        }
        setShowDropdown(null)
    }

    const handleDelete = async (voterId: string) => {
        // Note: This only removes from Supabase, not from blockchain
        // A full implementation would need a contract function to remove a voter
        console.log('Delete voter:', voterId)
        setShowDropdown(null)
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900 mb-2">Voters</h1>
                    <p className="text-gray-600">Manage voter registrations and verification</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 md:mt-0 btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Voter
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-4 text-center">
                    <div className="text-2xl font-bold text-primary-900">{voters.length}</div>
                    <div className="text-sm text-gray-500">Total Voters</div>
                </div>
                <div className="glass-card p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{verifiedCount}</div>
                    <div className="text-sm text-gray-500">Verified</div>
                </div>
                <div className="glass-card p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                    <div className="text-sm text-gray-500">Pending</div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by wallet address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input-field w-40"
                        >
                            <option value="all">All Status</option>
                            <option value="verified">Verified</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Voters Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Wallet Address</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Registered</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Votes Cast</th>
                                <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredVoters.map((voter) => (
                                <tr key={voter.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-mono text-sm">
                                            {formatAddress(voter.walletAddress)}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        {voter.isVerified ? (
                                            <span className="inline-flex items-center gap-1 badge-success">
                                                <CheckCircle className="w-3 h-3" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 badge-warning">
                                                <Clock className="w-3 h-3" />
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-600">
                                        {formatDateTime(voter.registeredAt)}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="font-medium">{voter.votesCount}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="relative flex justify-end">
                                            <button
                                                onClick={() => setShowDropdown(showDropdown === voter.id ? null : voter.id)}
                                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <MoreVertical className="w-5 h-5 text-gray-500" />
                                            </button>

                                            {showDropdown === voter.id && (
                                                <div className="absolute right-0 top-10 z-10 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48 animate-slide-down">
                                                    <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full">
                                                        <Eye className="w-4 h-4" />
                                                        View Details
                                                    </button>
                                                    {!voter.isVerified && (
                                                        <button
                                                            onClick={() => handleVerify(voter.id)}
                                                            className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 w-full"
                                                        >
                                                            <UserCheck className="w-4 h-4" />
                                                            Verify Voter
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(voter.id)}
                                                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredVoters.length === 0 && (
                    <div className="p-12 text-center">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No voters found</h3>
                        <p className="text-gray-500">
                            {searchQuery || statusFilter !== 'all'
                                ? 'Try adjusting your filters'
                                : 'Add voters to get started'}
                        </p>
                    </div>
                )}
            </div>

            {/* Add Voter Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-primary-900">Register New Voter</h3>
                            <button
                                onClick={() => { setShowAddModal(false); setNewVoterAddress(''); setError(null); setSuccess(null) }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            Registers the wallet address on-chain so the voter can participate in elections.
                            MetaMask will prompt you to confirm the transaction.
                        </p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex gap-2 items-start text-red-700">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex gap-2 items-start text-green-700">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{success}</span>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Wallet Address *
                            </label>
                            <input
                                type="text"
                                placeholder="0x..."
                                value={newVoterAddress}
                                onChange={(e) => { setNewVoterAddress(e.target.value); setError(null) }}
                                className="input-field font-mono"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowAddModal(false); setNewVoterAddress(''); setError(null); setSuccess(null) }}
                                className="btn-secondary flex-1"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleAddVoter}
                                disabled={!newVoterAddress || registerVoterMutation.isPending}
                                className="btn-primary flex-1 flex items-center justify-center gap-2"
                            >
                                {registerVoterMutation.isPending ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" />Registering…</>
                                ) : (
                                    'Register Voter'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
