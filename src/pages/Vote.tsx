import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Vote,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    User,
    Shield,
    Loader2,
    ExternalLink,
    Copy,
    Check
} from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { useContract } from '@/hooks/useContract'
import { formatAddress } from '@/lib/utils'

interface Candidate {
    id: number
    name: string
    party: string
    imageUrl?: string
}

// Demo data
const demoElection = {
    id: 1,
    name: 'Student Council Election 2024',
    description: 'Annual election for student council representatives. Please select one candidate.',
    endDate: new Date(Date.now() + 86400000 * 6).toISOString(),
}

const demoCandidates: Candidate[] = [
    { id: 1, name: 'Alice Johnson', party: 'Progressive Students' },
    { id: 2, name: 'Bob Smith', party: 'Student Unity Party' },
    { id: 3, name: 'Carol Williams', party: 'Innovation Alliance' },
    { id: 4, name: 'David Brown', party: 'Academic Excellence' },
]

export function VotePage() {
    const { electionId } = useParams()
    const navigate = useNavigate()
    const { isConnected, address, connect, signer, provider } = useWallet()
    const { castVote, isLoading: contractLoading } = useContract(signer, provider)

    const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
    const [step, setStep] = useState<'select' | 'confirm' | 'processing' | 'success'>('select')
    const [txHash, setTxHash] = useState<string | null>(null)
    const [voteHash, setVoteHash] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const candidates = demoCandidates
    const election = demoElection

    const handleVote = async () => {
        if (!selectedCandidate) return

        setStep('confirm')
    }

    const confirmVote = async () => {
        if (!selectedCandidate) return

        setStep('processing')
        setError(null)

        try {
            // In production, use actual contract:
            // const result = await castVote(parseInt(electionId!), selectedCandidate)

            // Demo: simulate transaction
            await new Promise(resolve => setTimeout(resolve, 2000))

            setTxHash('0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''))
            setVoteHash('0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''))
            setStep('success')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cast vote')
            setStep('confirm')
        }
    }

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const selectedCandidateData = candidates.find(c => c.id === selectedCandidate)

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
                        Please connect your MetaMask wallet to cast your vote.
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>

                {/* Election Header */}
                <div className="glass-card p-6 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Vote className="w-8 h-8 text-primary-700" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-primary-900 mb-2">
                                {election.name}
                            </h1>
                            <p className="text-gray-600">{election.description}</p>
                        </div>
                    </div>
                </div>

                {/* Step: Select Candidate */}
                {step === 'select' && (
                    <div>
                        <h2 className="text-xl font-bold text-primary-900 mb-6">
                            Select Your Candidate
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            {candidates.map((candidate) => (
                                <button
                                    key={candidate.id}
                                    onClick={() => setSelectedCandidate(candidate.id)}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all ${selectedCandidate === candidate.id
                                            ? 'border-primary-600 bg-primary-50'
                                            : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${selectedCandidate === candidate.id
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            <User className="w-7 h-7" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-primary-900">
                                                {candidate.name}
                                            </h3>
                                            <p className="text-gray-500">{candidate.party}</p>
                                        </div>
                                        {selectedCandidate === candidate.id && (
                                            <CheckCircle className="w-6 h-6 text-primary-600" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleVote}
                            disabled={!selectedCandidate}
                            className={`btn-primary w-full flex items-center justify-center gap-2 ${!selectedCandidate && 'opacity-50 cursor-not-allowed'
                                }`}
                        >
                            Continue to Confirm
                        </button>
                    </div>
                )}

                {/* Step: Confirm Vote */}
                {step === 'confirm' && selectedCandidateData && (
                    <div className="glass-card p-8">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-10 h-10 text-primary-700" />
                            </div>
                            <h2 className="text-2xl font-bold text-primary-900 mb-2">
                                Confirm Your Vote
                            </h2>
                            <p className="text-gray-600">
                                Please review your selection before submitting
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 mb-8">
                            <h3 className="text-sm text-gray-500 mb-2">Your Selection</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center">
                                    <User className="w-7 h-7" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-primary-900">
                                        {selectedCandidateData.name}
                                    </div>
                                    <div className="text-gray-500">{selectedCandidateData.party}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-yellow-800">
                                    <strong>Important:</strong> Once confirmed, your vote cannot be changed.
                                    A small gas fee will be charged for the blockchain transaction.
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
                                <div className="flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-red-800">{error}</div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep('select')}
                                className="btn-secondary flex-1"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={confirmVote}
                                className="btn-primary flex-1 flex items-center justify-center gap-2"
                            >
                                Sign & Submit Vote
                            </button>
                        </div>
                    </div>
                )}

                {/* Step: Processing */}
                {step === 'processing' && (
                    <div className="glass-card p-12 text-center">
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <Loader2 className="w-10 h-10 text-primary-700 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary-900 mb-4">
                            Processing Your Vote
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Please confirm the transaction in your MetaMask wallet.
                        </p>
                        <p className="text-sm text-gray-500">
                            This may take a few moments...
                        </p>
                    </div>
                )}

                {/* Step: Success */}
                {step === 'success' && selectedCandidateData && (
                    <div className="glass-card p-8">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-primary-900 mb-2">
                                Vote Successfully Cast!
                            </h2>
                            <p className="text-gray-600">
                                Your vote has been recorded on the blockchain
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <h3 className="text-sm text-gray-500 mb-2">You Voted For</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-primary-900">
                                        {selectedCandidateData.name}
                                    </div>
                                    <div className="text-gray-500">{selectedCandidateData.party}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-sm text-gray-500">Transaction Hash</div>
                                        <div className="font-mono text-sm text-primary-700">
                                            {formatAddress(txHash || '')}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(txHash || '')}
                                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-500" />}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-sm text-gray-500">Vote Hash (Receipt)</div>
                                        <div className="font-mono text-sm text-primary-700">
                                            {formatAddress(voteHash || '')}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(voteHash || '')}
                                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-500" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
                            <div className="flex gap-3">
                                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-green-800">
                                    Save your vote hash! You can use it to verify your vote was recorded correctly.
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="btn-secondary flex-1"
                            >
                                Back to Dashboard
                            </button>
                            <a
                                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary flex-1 flex items-center justify-center gap-2"
                            >
                                View on Etherscan
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
