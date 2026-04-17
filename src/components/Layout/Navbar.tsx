import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Vote, Shield, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { formatAddress } from '@/lib/utils'

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const location = useLocation()
    const { isConnected, address, connect, disconnect, isConnecting } = useWallet()

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'Security', path: '/security' },
    ]

    const isActive = (path: string) => location.pathname === path

    return (
        <nav className="navbar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                            <Vote className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-primary-800">BlockVote</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`font-medium transition-colors ${isActive(link.path)
                                        ? 'text-primary-700'
                                        : 'text-gray-600 hover:text-primary-700'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {isConnected ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 text-primary-700 font-medium hover:bg-primary-100 transition-colors"
                                >
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    {formatAddress(address || '')}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-slide-down z-50">
                                        <Link
                                            to="/dashboard"
                                            className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/admin"
                                            className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Admin Panel
                                        </Link>
                                        <hr className="my-2 border-gray-100" />
                                        <button
                                            onClick={() => {
                                                disconnect()
                                                setIsDropdownOpen(false)
                                            }}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={connect}
                                disabled={isConnecting}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Shield className="w-4 h-4" />
                                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-gray-700" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-slide-down">
                    <div className="px-4 py-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`block py-2 font-medium ${isActive(link.path)
                                        ? 'text-primary-700'
                                        : 'text-gray-600'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <hr className="border-gray-100" />
                        {isConnected ? (
                            <>
                                <div className="py-2 text-sm text-gray-500">
                                    Connected: {formatAddress(address || '')}
                                </div>
                                <Link
                                    to="/dashboard"
                                    className="block py-2 font-medium text-gray-600"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        disconnect()
                                        setIsMobileMenuOpen(false)
                                    }}
                                    className="w-full text-left py-2 font-medium text-red-600"
                                >
                                    Disconnect
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    connect()
                                    setIsMobileMenuOpen(false)
                                }}
                                className="w-full btn-primary"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
