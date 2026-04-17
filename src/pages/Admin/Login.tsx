import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Wallet, AlertCircle, Loader2 } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { useAdminVerify } from '@/hooks/useQueries'

export function AdminLogin() {
    const navigate = useNavigate()
    const { address, isConnected, isConnecting, connect } = useWallet()
    const { data: isAdmin, isLoading: adminLoading } = useAdminVerify(address)
    const [error, setError] = useState<string | null>(null)

    // Once wallet is connected and admin check resolves, navigate or show error
    useEffect(() => {
        if (!isConnected || !address || adminLoading) return
        if (isAdmin === true) {
            navigate('/admin')
        } else if (isAdmin === false) {
            setError(
                'This wallet does not have admin privileges. ' +
                'Please switch to the admin wallet (0xf39F…2266) in MetaMask and try again.'
            )
        }
    }, [isAdmin, adminLoading, isConnected, address, navigate])

    const handleConnect = async () => {
        setError(null)
        await connect()
    }

    const isVerifying = isConnected && adminLoading

    return (
        <div className="min-h-screen bg-gradient-dark flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">BlockVote Admin</span>
                    </Link>
                </div>

                {/* Login Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                    <h1 className="text-2xl font-bold text-center text-white mb-2">
                        Admin Portal
                    </h1>
                    <p className="text-gray-300 text-center mb-8">
                        Connect your admin wallet to manage elections and voters
                    </p>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
                            <div className="flex gap-2 items-start text-red-200">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{error}</span>
                            </div>
                        </div>
                    )}

                    {isVerifying ? (
                        <div className="flex flex-col items-center gap-3 py-6">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                            <p className="text-gray-300 text-sm">Verifying admin privileges on-chain…</p>
                        </div>
                    ) : (
                        <button
                            onClick={handleConnect}
                            disabled={isConnecting}
                            className="w-full py-3 px-6 bg-white text-blue-700 font-semibold rounded-xl shadow-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {isConnecting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Connecting…
                                </>
                            ) : (
                                <>
                                    <Wallet className="w-5 h-5" />
                                    Connect Admin Wallet
                                </>
                            )}
                        </button>
                    )}

                    <div className="mt-4 p-3 bg-white/5 rounded-xl">
                        <p className="text-gray-400 text-xs text-center leading-relaxed">
                            In MetaMask, switch to the <strong className="text-gray-200">BlockVote Admin</strong> account
                            before clicking Connect. The admin address is{' '}
                            <span className="font-mono text-gray-200">0xf39F…2266</span>.
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <Link to="/login" className="text-gray-300 hover:text-white text-sm">
                            ← Back to User Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
