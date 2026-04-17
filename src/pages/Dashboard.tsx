import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Vote,
    Clock,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    Calendar,
    Users,
    BarChart3,
    FileText,
    ExternalLink
} from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { useContract } from '@/hooks/useContract'
import { formatDateTime } from '@/lib/utils'
import type { Election } from '@/types'

// Demo elections data (replace with actual contract data in production)
const demoElections: Election[] = [
    {
        id: '1',
        name: 'Student Council Election 2024',
        description: 'Annual election for student council representatives',
        startDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        endDate: new Date(Date.now() + 86400000 * 6).toISOString(), // 6 days from now
        status: 'active',
        electionCode: 'SC2024',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
        id: '2',
        name: 'Board Member Selection',
        description: 'Selection of new board members for 2024',
        startDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        endDate: new Date(Date.now() + 86400000 * 9).toISOString(), // 9 days from now
        status: 'upcoming',
        electionCode: 'BMS2024',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
        id: '3',
        name: 'Community Project Vote',
        description: 'Vote on the next community improvement project',
        startDate: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 days ago
        endDate: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
        status: 'completed',
        electionCode: 'CPV2024',
        createdAt: new Date(Date.now() - 86400000 * 21).toISOString(),
    },
]

export function Dashboard() {
    const navigate = useNavigate()
    const { isConnected, address, connect } = useWallet()
    const { signer, provider } = useWallet()
    const { isRegisteredVoter, hasVoted } = useContract(signer, provider)

    const [isVerified, setIsVerified] = useState(false)
    const [elections, setElections] = useState<Election[]>(demoElections)
    const [votedElections, setVotedElections] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (address) {
            // Check if voter is registered (demo: always verified for demo)
            setIsVerified(true)

            // In production, check actual registration:
            // isRegisteredVoter(address).then(setIsVerified)
        }
    }, [address])

    const activeElections = elections.filter(e => e.status === 'active')
    const upcomingElections = elections.filter(e => e.status === 'upcoming')
    const completedElections = elections.filter(e => e.status === 'completed')

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="badge-success">Active</span>
            case 'upcoming':
                return <span className="badge-info">Upcoming</span>
            case 'completed':
                return <span className="badge-warning">Completed</span>
            default:
                return null
        }
    }

    if (!isConnected) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-gradient-section">
                <div className="glass-card p-12 max-w-md text-center">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Vote className="w-10 h-10 text-primary-700" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary-900 mb-4">
                        Connect Your Wallet
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Please connect your MetaMask wallet to access your voting dashboard.
                    </p>
                    <button onClick={connect} className="btn-primary w-full">
                        Connect Wallet
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-section py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-primary-900 mb-2">
                            Voter Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Welcome back! Here's your voting overview.
                        </p>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center gap-3">
                        {isVerified ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-xl text-green-700">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Verified Voter</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-xl text-yellow-700">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-medium">Pending Verification</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="stat-card">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Vote className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold">{activeElections.length}</div>
                                <div className="text-sm text-gray-300">Active Elections</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold">{votedElections.size}</div>
                                <div className="text-sm text-green-200">Votes Cast</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold">{upcomingElections.length}</div>
                                <div className="text-sm text-blue-200">Upcoming</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-600 to-gray-700 text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold">{completedElections.length}</div>
                                <div className="text-sm text-gray-300">Completed</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Elections */}
                {activeElections.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                            <Vote className="w-5 h-5 text-green-600" />
                            Active Elections
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeElections.map((election) => (
                                <div key={election.id} className="glass-card-hover p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-primary-900">
                                            {election.name}
                                        </h3>
                                        {getStatusBadge(election.status)}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {election.description}
                                    </p>
                                    <div className="space-y-2 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Ends: {formatDateTime(election.endDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            <span>Code: {election.electionCode}</span>
                                        </div>
                                    </div>

                                    {votedElections.has(election.id) ? (
                                        <div className="flex items-center gap-2 text-green-600 font-medium">
                                            <CheckCircle className="w-5 h-5" />
                                            Vote Submitted
                                        </div>
                                    ) : (
                                        <Link
                                            to={`/vote/${election.id}`}
                                            className="btn-primary w-full flex items-center justify-center gap-2"
                                        >
                                            Cast Vote
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upcoming Elections */}
                {upcomingElections.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            Upcoming Elections
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingElections.map((election) => (
                                <div key={election.id} className="glass-card p-6 opacity-80">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-primary-900">
                                            {election.name}
                                        </h3>
                                        {getStatusBadge(election.status)}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {election.description}
                                    </p>
                                    <div className="space-y-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Starts: {formatDateTime(election.startDate)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed Elections */}
                {completedElections.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-gray-600" />
                            Completed Elections
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {completedElections.map((election) => (
                                <div key={election.id} className="glass-card p-6 opacity-70">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-primary-900">
                                            {election.name}
                                        </h3>
                                        {getStatusBadge(election.status)}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {election.description}
                                    </p>
                                    <Link
                                        to={`/results/${election.id}`}
                                        className="text-primary-700 font-medium flex items-center gap-1 hover:gap-2 transition-all"
                                    >
                                        View Results
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {elections.length === 0 && (
                    <div className="glass-card p-12 text-center">
                        <Vote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">
                            No Elections Available
                        </h3>
                        <p className="text-gray-500">
                            There are no elections available at the moment. Check back later!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
