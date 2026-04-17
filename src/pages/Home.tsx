import { Link } from 'react-router-dom'
import {
    Shield,
    Lock,
    FileCheck,
    Fingerprint,
    BarChart3,
    Users,
    ChevronRight,
    Vote,
    CheckCircle,
    Globe,
    Zap
} from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'

export function Home() {
    const { isConnected, connect } = useWallet()

    const features = [
        {
            icon: Lock,
            title: 'End-to-End Encryption',
            description: 'Every vote is encrypted from the moment it leaves your device until it\'s recorded on the blockchain.',
        },
        {
            icon: FileCheck,
            title: 'Paper Trail & Digital Receipts',
            description: 'Every voter receives a cryptographically signed receipt to verify their vote was counted correctly.',
        },
        {
            icon: Shield,
            title: 'Immutable Logging & Storage',
            description: 'All transactions are permanently recorded on the Ethereum blockchain, creating an auditable trail.',
        },
        {
            icon: Fingerprint,
            title: 'Wallet Verification',
            description: 'Secure authentication through MetaMask ensures only verified voters can participate.',
        },
        {
            icon: BarChart3,
            title: 'Risk Assessment & Audits',
            description: 'Regular security audits and vulnerability assessments to maintain the highest security standards.',
        },
        {
            icon: Users,
            title: 'Data Security & Privacy',
            description: 'Your personal data is never stored on the blockchain. Vote in complete anonymity.',
        },
    ]

    const steps = [
        {
            number: 1,
            title: 'Ballot Receipt',
            description: 'After voting, you\'ll receive an encrypted and anonymous printable ballot receipt you can verify your selections.',
        },
        {
            number: 2,
            title: 'Paper Ballot',
            description: 'A paper ballot is generated and printed at the jurisdiction\'s office. Voters can review at any time.',
        },
        {
            number: 3,
            title: 'Blockchain Data',
            description: 'All votes are stored as "transactions" on the blockchain - each an anonymous, immutable record that can be audited.',
        },
    ]

    const stats = [
        { value: '100K+', label: 'Votes Cast' },
        { value: '500+', label: 'Elections Held' },
        { value: '99.9%', label: 'Uptime' },
        { value: '0', label: 'Security Breaches' },
    ]

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative bg-gradient-hero min-h-[90vh] flex items-center">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-100/40 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left animate-fade-in">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 font-medium text-sm mb-6">
                                <Zap className="w-4 h-4" />
                                Powered by Ethereum Blockchain
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-900 leading-tight mb-6">
                                Secure Voting
                                <span className="block text-gradient">at Your Fingertips</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                                Experience the future of democracy with our blockchain-powered voting platform.
                                Transparent, secure, and accessible from anywhere.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                {isConnected ? (
                                    <Link to="/dashboard" className="btn-primary inline-flex items-center justify-center gap-2">
                                        Go to Dashboard
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                ) : (
                                    <button onClick={connect} className="btn-primary inline-flex items-center justify-center gap-2">
                                        Get Started
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                )}
                                <Link to="/how-it-works" className="btn-secondary inline-flex items-center justify-center gap-2">
                                    Learn More
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image/Illustration */}
                        <div className="relative animate-fade-in animation-delay-300">
                            <div className="relative">
                                {/* Main Card */}
                                <div className="glass-card p-8 transform hover:scale-105 transition-transform duration-500">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center">
                                            <Vote className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-primary-900">BlockVote</h3>
                                            <p className="text-gray-500 text-sm">Decentralized Voting</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <span className="text-green-800 font-medium">Blockchain Verified</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                            <Shield className="w-5 h-5 text-blue-600" />
                                            <span className="text-blue-800 font-medium">End-to-End Encrypted</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                                            <Globe className="w-5 h-5 text-purple-600" />
                                            <span className="text-purple-800 font-medium">Vote from Anywhere</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating elements */}
                                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4 animate-float">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-sm font-medium text-gray-700">Secure Connection</span>
                                    </div>
                                </div>

                                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 animate-float animation-delay-500">
                                    <div className="text-2xl font-bold text-primary-700">100K+</div>
                                    <div className="text-sm text-gray-500">Votes Cast</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-primary-700 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-500 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Features Section */}
            <section className="py-24 bg-gradient-section">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-header">Security is Our Top Priority</h2>
                        <p className="section-subheader">
                            Democracy requires verifiable elections and trust. Here's how we verify and trust.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="feature-card group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-7 h-7 text-primary-700" />
                                </div>
                                <h3 className="text-xl font-bold text-primary-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Verify Your Vote Section */}
            <section className="py-24 bg-gradient-dark text-white relative overflow-hidden">
                {/* World Map Background */}
                <div className="absolute inset-0 opacity-10">
                    <svg viewBox="0 0 1200 600" className="w-full h-full">
                        <path
                            fill="currentColor"
                            d="M0,300 Q300,200 600,300 T1200,300 L1200,600 L0,600 Z"
                        />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Verify Your Vote</h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Each ballot produces three records so you can confirm your vote was counted,
                            and your jurisdiction can verify the results.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-white/20" />
                                )}

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="step-circle-active mb-6">
                                        {step.number}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-section">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-primary-900 mb-6">
                        Ready to Experience Secure Voting?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join thousands of voters who trust BlockVote for transparent and secure elections.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isConnected ? (
                            <Link to="/dashboard" className="btn-primary inline-flex items-center justify-center gap-2">
                                Go to Dashboard
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        ) : (
                            <button onClick={connect} className="btn-primary inline-flex items-center justify-center gap-2">
                                Connect Wallet
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                        <Link to="/security" className="btn-secondary inline-flex items-center justify-center">
                            Learn About Security
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
