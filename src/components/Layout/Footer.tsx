import { Link } from 'react-router-dom'
import { Vote, Twitter, Github, Mail } from 'lucide-react'

export function Footer() {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        company: [
            { name: 'Home', path: '/' },
            { name: 'How It Works', path: '/how-it-works' },
            { name: 'Contact Us', path: '/contact' },
        ],
        security: [
            { name: 'Our Approach', path: '/security' },
            { name: 'Security Statement', path: '/security#statement' },
            { name: 'Security Audits', path: '/security#audits' },
        ],
        resources: [
            { name: 'FAQ', path: '/faq' },
            { name: 'Documentation', path: '/docs' },
            { name: 'Support', path: '/support' },
        ],
        legal: [
            { name: 'Terms of Service', path: '/terms' },
            { name: 'Privacy Policy', path: '/privacy' },
        ],
    }

    return (
        <footer className="bg-gradient-dark text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Vote className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">BlockVote</span>
                        </Link>
                        <p className="text-gray-300 mb-6 max-w-sm">
                            Secure, transparent, and accessible blockchain-based voting for everyone.
                            Empowering democracy through technology.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:contact@blockvote.io"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-300 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Security Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Security</h4>
                        <ul className="space-y-3">
                            {footerLinks.security.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-300 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Resources</h4>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-300 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} BlockVote. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        {footerLinks.legal.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
