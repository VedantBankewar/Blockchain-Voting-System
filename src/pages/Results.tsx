import { useParams, Link } from 'react-router-dom'
import {
    ArrowLeft,
    Trophy,
    CheckCircle,
    Clock,
    BarChart3,
    ExternalLink,
    AlertCircle
} from 'lucide-react'
import { useElection, useCandidates } from '@/hooks/useQueries'
import { formatDateTime } from '@/lib/utils'
import { PageLoader } from '@/components/ui/States'

export function Results() {
    const { electionId } = useParams()
    const electionIdNum = electionId ? parseInt(electionId, 10) : null

    const { data: election, isLoading: electionLoading, isError: electionError } = useElection(electionIdNum)
    const { data: candidates, isLoading: candidatesLoading } = useCandidates(electionIdNum)

    if (electionLoading || candidatesLoading) {
        return <PageLoader />
    }

    if (electionError || !election) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-gradient-section">
                <div className="glass-card p-12 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-primary-900 mb-4">Election Not Found</h2>
                    <p className="text-gray-600 mb-8">This election does not exist or could not be loaded.</p>
                    <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
                </div>
            </div>
        )
    }

    // Calculate results from contract data
    const totalVotes = candidates?.reduce((sum, c) => sum + c.voteCount, 0) || 0
    const electionResults = {
        id: electionId,
        name: election.name,
        description: election.description,
        startDate: new Date(election.startTime * 1000).toISOString(),
        endDate: new Date(election.endTime * 1000).toISOString(),
        totalVotes,
        status: !election.isActive ? 'completed' : 'active',
    }

    const candidatesWithPercentage = (candidates || []).map(c => ({
        ...c,
        votes: c.voteCount,
        percentage: totalVotes > 0 ? (c.voteCount / totalVotes) * 100 : 0,
    })).sort((a, b) => b.votes - a.votes)

    const winner = candidatesWithPercentage[0]
    const participation = 0 // Would need total registered voters from contract

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
                            <span className={`mb-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${election.isActive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                {election.isActive ? <CheckCircle className="w-4 h-4" /> : null}
                                {election.isActive ? 'Active' : 'Completed'}
                            </span>
                            <h1 className="text-3xl font-bold text-primary-900 mb-2">{electionResults.name}</h1>
                            <p className="text-gray-600">{electionResults.description}</p>
                        </div>
                        <BarChart3 className="w-12 h-12 text-primary-300" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-primary-900">{electionResults.totalVotes}</div>
                            <div className="text-sm text-gray-500">Total Votes</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-primary-900">-</div>
                            <div className="text-sm text-gray-500">Registered Voters</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{participation || '-'}%</div>
                            <div className="text-sm text-gray-500">Participation</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-primary-900">{candidates?.length || 0}</div>
                            <div className="text-sm text-gray-500">Candidates</div>
                        </div>
                    </div>
                </div>

                {/* Winner Card */}
                {winner && (
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
                                <span className="text-3xl font-bold text-green-600">{winner.percentage.toFixed(1)}%</span>
                                <span className="text-gray-500 ml-2">of total</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Breakdown */}
                <div className="glass-card p-8">
                    <h2 className="text-xl font-bold text-primary-900 mb-6">Results Breakdown</h2>

                    {candidatesWithPercentage.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No votes have been cast yet.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {candidatesWithPercentage.map((candidate, index) => (
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
                                            <div className="text-sm text-gray-500">{candidate.percentage.toFixed(1)}%</div>
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
                    )}
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
                            {formatDateTime(electionResults.startDate)} - {formatDateTime(electionResults.endDate)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
