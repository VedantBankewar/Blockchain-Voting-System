import { useParams, Link } from 'react-router-dom'
import {
    ArrowLeft,
    Trophy,
    Users,
    CheckCircle,
    Clock,
    BarChart3,
    ExternalLink
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

// Demo data
const demoResults = {
    election: {
        id: '1',
        name: 'Student Council Election 2024',
        description: 'Annual election for student council representatives',
        startDate: new Date(Date.now() - 86400000 * 14).toISOString(),
        endDate: new Date(Date.now() - 86400000 * 7).toISOString(),
        totalVoters: 500,
        totalVotes: 423,
        status: 'completed',
    },
    candidates: [
        { id: 1, name: 'Alice Johnson', party: 'Progressive Students', votes: 156, percentage: 36.9 },
        { id: 2, name: 'Bob Smith', party: 'Student Unity Party', votes: 134, percentage: 31.7 },
        { id: 3, name: 'Carol Williams', party: 'Innovation Alliance', votes: 89, percentage: 21.0 },
        { id: 4, name: 'David Brown', party: 'Academic Excellence', votes: 44, percentage: 10.4 },
    ],
}

export function Results() {
    const { electionId } = useParams()
    const { election, candidates } = demoResults

    const winner = candidates[0]
    const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes)
    const participation = ((election.totalVotes / election.totalVoters) * 100).toFixed(1)

    return (
        <div className="min-h-screen bg-gradient-section py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <div className="glass-card p-8 mb-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <span className="badge-success mb-2">Completed</span>
                            <h1 className="text-3xl font-bold text-primary-900 mb-2">
                                {election.name}
                            </h1>
                            <p className="text-gray-600">{election.description}</p>
                        </div>
                        <BarChart3 className="w-12 h-12 text-primary-300" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-primary-900">{election.totalVotes}</div>
                            <div className="text-sm text-gray-500">Total Votes</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-primary-900">{election.totalVoters}</div>
                            <div className="text-sm text-gray-500">Registered Voters</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{participation}%</div>
                            <div className="text-sm text-gray-500">Participation</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-primary-900">{candidates.length}</div>
                            <div className="text-sm text-gray-500">Candidates</div>
                        </div>
                    </div>
                </div>

                {/* Winner Card */}
                <div className="glass-card p-8 mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <div className="text-sm text-yellow-700 font-medium">Winner</div>
                            <h2 className="text-2xl font-bold text-primary-900">{winner.name}</h2>
                            <p className="text-gray-600">{winner.party}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div>
                            <span className="text-3xl font-bold text-primary-900">{winner.votes}</span>
                            <span className="text-gray-500 ml-2">votes</span>
                        </div>
                        <div>
                            <span className="text-3xl font-bold text-green-600">{winner.percentage}%</span>
                            <span className="text-gray-500 ml-2">of total</span>
                        </div>
                    </div>
                </div>

                {/* Results Breakdown */}
                <div className="glass-card p-8">
                    <h2 className="text-xl font-bold text-primary-900 mb-6">Results Breakdown</h2>

                    <div className="space-y-6">
                        {sortedCandidates.map((candidate, index) => (
                            <div key={candidate.id} className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-400 text-white' :
                                                index === 1 ? 'bg-gray-300 text-white' :
                                                    index === 2 ? 'bg-orange-400 text-white' :
                                                        'bg-gray-200 text-gray-600'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-primary-900">{candidate.name}</div>
                                            <div className="text-sm text-gray-500">{candidate.party}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-primary-900">{candidate.votes} votes</div>
                                        <div className="text-sm text-gray-500">{candidate.percentage}%</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                                                index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                                                    index === 2 ? 'bg-gradient-to-r from-orange-300 to-orange-400' :
                                                        'bg-gray-300'
                                            }`}
                                        style={{ width: `${candidate.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Blockchain Verification */}
                <div className="glass-card p-6 mt-8 bg-primary-50 border border-primary-100">
                    <div className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-primary-900 mb-1">
                                Results Verified on Blockchain
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                All votes have been recorded on the Ethereum blockchain and can be independently verified.
                            </p>
                            <a
                                href="https://sepolia.etherscan.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center gap-1"
                            >
                                View on Etherscan
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Election Period */}
                <div className="glass-card p-6 mt-6">
                    <div className="flex items-center gap-4">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Voting Period:</span>{' '}
                            {formatDateTime(election.startDate)} - {formatDateTime(election.endDate)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
