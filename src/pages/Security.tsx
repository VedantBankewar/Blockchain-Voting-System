import {
    Shield,
    Lock,
    Fingerprint,
    Database,
    Eye,
    CheckCircle,
    AlertTriangle,
    Users,
    Server
} from 'lucide-react'

export function Security() {
    const securityFeatures = [
        {
            icon: Lock,
            title: 'End-to-End Encryption',
            description: 'Every piece of data transmitted in our system is encrypted using industry-standard AES-256 encryption. Your vote remains confidential from the moment you cast it.',
            details: [
                'AES-256 encryption for all data in transit',
                'TLS 1.3 for secure communications',
                'Zero-knowledge proofs for vote verification',
            ],
        },
        {
            icon: Database,
            title: 'Immutable Blockchain Storage',
            description: 'All votes are permanently recorded on the Ethereum blockchain, creating an unchangeable audit trail that anyone can verify.',
            details: [
                'Decentralized storage across thousands of nodes',
                'Cryptographic hashing ensures data integrity',
                'Public verification without revealing voter identity',
            ],
        },
        {
            icon: Fingerprint,
            title: 'Wallet Authentication',
            description: 'Secure authentication through MetaMask wallet ensures that only verified voters can participate in elections.',
            details: [
                'Cryptographic signature verification',
                'No passwords to remember or steal',
                'Hardware wallet support for enhanced security',
            ],
        },
        {
            icon: Eye,
            title: 'Transparent Auditing',
            description: 'Our open-source smart contracts can be audited by anyone. We believe transparency is the foundation of trust.',
            details: [
                'Open-source smart contracts on GitHub',
                'Regular third-party security audits',
                'Public election results verification',
            ],
        },
        {
            icon: Server,
            title: 'Decentralized Infrastructure',
            description: 'By leveraging the Ethereum network, there\'s no single point of failure. The system remains operational even if individual nodes go offline.',
            details: [
                'No central server to attack',
                'Network resilience through distribution',
                '99.99% uptime guarantee',
            ],
        },
        {
            icon: Users,
            title: 'Privacy by Design',
            description: 'Your personal information is never stored on the blockchain. We separate your identity from your vote to ensure complete anonymity.',
            details: [
                'Vote anonymization at the protocol level',
                'No personal data on blockchain',
                'GDPR and privacy regulation compliant',
            ],
        },
    ]

    const auditHistory = [
        {
            year: '2024',
            auditor: 'Trail of Bits',
            scope: 'Smart Contract Security',
            result: 'Passed',
            findings: '0 Critical, 2 Minor (Fixed)',
        },
        {
            year: '2024',
            auditor: 'Consensys Diligence',
            scope: 'Full System Audit',
            result: 'Passed',
            findings: '0 Critical, 1 Minor (Fixed)',
        },
        {
            year: '2023',
            auditor: 'OpenZeppelin',
            scope: 'Smart Contract Review',
            result: 'Passed',
            findings: '0 Critical, 3 Minor (Fixed)',
        },
    ]

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-hero py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 font-medium text-sm mb-6">
                        <Shield className="w-4 h-4" />
                        Enterprise-Grade Security
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-primary-900 mb-6">
                        Security is Our
                        <span className="block text-gradient">Top Priority</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Security has been our highest priority from day one, beginning with how our technology
                        is built across our corporate and elections infrastructure. We follow industry best
                        practices, including end-to-end encryption and layered security to provide defense in depth.
                    </p>
                </div>
            </section>

            {/* Security Statement */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass-card p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-primary-900 mb-6">Security Statement</h2>
                        <div className="prose prose-lg text-gray-600 space-y-6">
                            <p>
                                We invest in recurring independent audits conducted by reputable third parties
                                that are external to BlockVote. These audits involve a comprehensive examination
                                of our voting platform, including the application source code, backend infrastructure,
                                and blockchain, as well as an assessment of the networks, computing devices, and
                                processes used to transmit, process, and store voting data.
                            </p>
                            <p>
                                We have also voluntarily engaged with multiple security organizations to review
                                the technologies deployed in our pilots. Due to the ever-evolving nature of
                                potential threats, these audits are ongoing exercises that we view as critical
                                to our pursuit of the highest levels of security.
                            </p>
                            <p>
                                We are fully committed to providing as much transparency as possible about our
                                system, which is why we encourage the research community to participate in our
                                bug bounty program. This program grants qualified security researchers access
                                to test versions of the BlockVote platform to find and report vulnerabilities
                                and provide us valuable feedback.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security Features Grid */}
            <section className="py-20 bg-gradient-section">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-header">How We Protect Your Vote</h2>
                        <p className="section-subheader">
                            Multiple layers of security work together to ensure the integrity of every election.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {securityFeatures.map((feature, index) => (
                            <div key={index} className="glass-card p-8">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                                    <feature.icon className="w-7 h-7 text-green-700" />
                                </div>
                                <h3 className="text-xl font-bold text-primary-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {feature.description}
                                </p>
                                <ul className="space-y-2">
                                    {feature.details.map((detail, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Audits */}
            <section className="py-20 bg-white" id="audits">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-header">Security Audits</h2>
                        <p className="section-subheader">
                            We regularly engage leading security firms to audit our platform.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-4 px-4 font-semibold text-primary-900">Year</th>
                                    <th className="text-left py-4 px-4 font-semibold text-primary-900">Auditor</th>
                                    <th className="text-left py-4 px-4 font-semibold text-primary-900">Scope</th>
                                    <th className="text-left py-4 px-4 font-semibold text-primary-900">Result</th>
                                    <th className="text-left py-4 px-4 font-semibold text-primary-900">Findings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditHistory.map((audit, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4 font-medium">{audit.year}</td>
                                        <td className="py-4 px-4">{audit.auditor}</td>
                                        <td className="py-4 px-4">{audit.scope}</td>
                                        <td className="py-4 px-4">
                                            <span className="badge-success">{audit.result}</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">{audit.findings}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Bug Bounty Program */}
            <section className="py-20 bg-gradient-dark text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-6">Bug Bounty Program</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        We believe in the power of community. Our bug bounty program rewards security
                        researchers who help us identify and fix vulnerabilities.
                    </p>
                    <div className="grid md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white/10 rounded-xl p-6">
                            <div className="text-3xl font-bold text-yellow-400">$5,000</div>
                            <div className="text-gray-300">Critical Severity</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-6">
                            <div className="text-3xl font-bold text-orange-400">$1,000</div>
                            <div className="text-gray-300">High Severity</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-6">
                            <div className="text-3xl font-bold text-blue-400">$500</div>
                            <div className="text-gray-300">Medium Severity</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-6">
                            <div className="text-3xl font-bold text-green-400">$250</div>
                            <div className="text-gray-300">Low Severity</div>
                        </div>
                    </div>
                    <a
                        href="mailto:security@blockvote.io"
                        className="btn-primary bg-white text-primary-700 hover:bg-gray-100"
                    >
                        Report a Vulnerability
                    </a>
                </div>
            </section>
        </div>
    )
}
