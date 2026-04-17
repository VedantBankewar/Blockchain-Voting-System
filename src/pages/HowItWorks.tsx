import { Link } from 'react-router-dom'
import {
    Wallet,
    ClipboardCheck,
    Vote,
    CheckCircle,
    ChevronRight,
    Shield,
    Users,
    FileText
} from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'

export function HowItWorks() {
    const { isConnected, connect } = useWallet()

    const voterSteps = [
        {
            icon: Wallet,
            title: 'Connect Your Wallet',
            description: 'Connect your MetaMask wallet to securely authenticate your identity. Your wallet serves as your digital ID for voting.',
            details: 'Make sure you have MetaMask installed and some ETH for gas fees.',
        },
        {
            icon: ClipboardCheck,
            title: 'Get Verified',
            description: 'An admin will verify your wallet address and register you as an eligible voter for specific elections.',
            details: 'Verification is required only once per election.',
        },
        {
            icon: Vote,
            title: 'Cast Your Vote',
            description: 'Select your preferred candidate and sign the transaction. Your vote is encrypted and recorded on the blockchain.',
            details: 'Each vote is a blockchain transaction with a unique hash.',
        },
        {
            icon: CheckCircle,
            title: 'Verify Your Vote',
            description: 'After voting, you\'ll receive a vote receipt. Use the transaction hash to verify your vote on the blockchain.',
            details: 'Your vote is anonymous but verifiable.',
        },
    ]

    const adminSteps = [
        {
            icon: Users,
            title: 'Create Election',
            description: 'Set up a new election with name, description, and voting period.',
        },
        {
            icon: FileText,
            title: 'Add Candidates',
            description: 'Register candidates with their names and party affiliations.',
        },
        {
            icon: Shield,
            title: 'Verify Voters',
            description: 'Register wallet addresses of eligible voters.',
        },
        {
            icon: CheckCircle,
            title: 'Monitor Results',
            description: 'View real-time vote counts and election analytics.',
        },
    ]

    const faqs = [
        {
            question: 'Do I need cryptocurrency to vote?',
            answer: 'Yes, you need a small amount of ETH (Ethereum) to pay for the transaction gas fees when casting your vote. The typical cost is less than $1.',
        },
        {
            question: 'Is my vote really anonymous?',
            answer: 'Yes! While your wallet address is recorded on the blockchain, there\'s no link between your wallet address and your personal identity. Your actual vote choice is encrypted.',
        },
        {
            question: 'What if I make a mistake?',
            answer: 'Once a vote is cast and confirmed on the blockchain, it cannot be changed. Please review your selection carefully before confirming.',
        },
        {
            question: 'Can I vote from my phone?',
            answer: 'Yes, if you have the MetaMask mobile app installed, you can vote from any device with an internet connection.',
        },
        {
            question: 'How do I know my vote was counted?',
            answer: 'After voting, you\'ll receive a transaction hash. You can use this to verify your vote on the Ethereum blockchain explorer.',
        },
    ]

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-hero py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-primary-900 mb-6">
                        How BlockVote Works
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Voting on the blockchain is simple, secure, and transparent.
                        Follow these steps to participate in secure elections.
                    </p>
                </div>
            </section>

            {/* For Voters Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-4">
                            <Vote className="w-4 h-4" />
                            For Voters
                        </div>
                        <h2 className="section-header">Cast Your Vote in 4 Easy Steps</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {voterSteps.map((step, index) => (
                            <div key={index} className="relative">
                                {/* Step Number */}
                                <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary-700 text-white rounded-full flex items-center justify-center font-bold text-lg z-10">
                                    {index + 1}
                                </div>

                                <div className="glass-card-hover p-8 h-full">
                                    <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mb-6">
                                        <step.icon className="w-7 h-7 text-primary-700" />
                                    </div>
                                    <h3 className="text-xl font-bold text-primary-900 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {step.description}
                                    </p>
                                    <p className="text-sm text-gray-500 italic">
                                        {step.details}
                                    </p>
                                </div>

                                {/* Connector Arrow (except last) */}
                                {index < voterSteps.length - 1 && (
                                    <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                                        <ChevronRight className="w-8 h-8 text-primary-300" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        {isConnected ? (
                            <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
                                Go to Dashboard
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        ) : (
                            <button onClick={connect} className="btn-primary inline-flex items-center gap-2">
                                Connect Wallet to Start
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* For Admins Section */}
            <section className="py-20 bg-gradient-section">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium text-sm mb-4">
                            <Shield className="w-4 h-4" />
                            For Administrators
                        </div>
                        <h2 className="section-header">Managing Elections</h2>
                        <p className="section-subheader">
                            Administrators have powerful tools to create and manage secure elections.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {adminSteps.map((step, index) => (
                            <div key={index} className="glass-card p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <step.icon className="w-6 h-6 text-purple-700" />
                                </div>
                                <h3 className="font-bold text-primary-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/admin" className="btn-secondary inline-flex items-center gap-2">
                            Access Admin Panel
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Video Demo Section */}
            <section className="py-20 bg-gradient-dark text-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6">See It in Action</h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Watch a quick demonstration of how to cast your vote using BlockVote.
                    </p>

                    <div className="aspect-video bg-white/10 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/30 cursor-pointer transition-colors">
                                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <p className="text-gray-400">Demo Video Coming Soon</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-header">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="glass-card p-6">
                                <h3 className="text-lg font-semibold text-primary-900 mb-3">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
