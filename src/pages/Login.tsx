import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Vote,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Wallet,
    AlertCircle,
    Loader2
} from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'

export function Login() {
    const navigate = useNavigate()
    const { connect, isConnected, isConnecting, address } = useWallet()

    const [loginMethod, setLoginMethod] = useState<'email' | 'wallet'>('wallet')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            // TODO: Implement Supabase authentication
            // const { data, error } = await supabase.auth.signInWithPassword({
            //   email,
            //   password,
            // })

            // Simulate login for demo
            await new Promise(resolve => setTimeout(resolve, 1000))

            // For demo, redirect to dashboard
            navigate('/dashboard')
        } catch (err) {
            setError('Invalid email or password')
        } finally {
            setIsLoading(false)
        }
    }

    const handleWalletLogin = async () => {
        setError(null)
        try {
            await connect()
            if (isConnected) {
                navigate('/dashboard')
            }
        } catch (err) {
            setError('Failed to connect wallet. Please try again.')
        }
    }

    // If wallet is connected, redirect to dashboard
    if (isConnected && loginMethod === 'wallet') {
        navigate('/dashboard')
    }

    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                            <Vote className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-blue-900">BlockVote</span>
                    </Link>
                </div>

                {/* Login Card */}
                <div className="glass-card p-8">
                    <h1 className="text-2xl font-bold text-center text-blue-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 text-center mb-8">
                        Sign in to access your voting dashboard
                    </p>

                    {/* Login Method Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setLoginMethod('wallet')}
                            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${loginMethod === 'wallet'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Wallet className="w-5 h-5 inline-block mr-2" />
                            Wallet
                        </button>
                        <button
                            onClick={() => setLoginMethod('email')}
                            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${loginMethod === 'email'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Mail className="w-5 h-5 inline-block mr-2" />
                            Email
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                            <div className="flex gap-2 items-center text-red-700">
                                <AlertCircle className="w-5 h-5" />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {loginMethod === 'wallet' ? (
                        <div className="space-y-6">
                            <div className="bg-blue-50 rounded-xl p-6 text-center">
                                <Wallet className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="font-semibold text-blue-900 mb-2">
                                    Connect with MetaMask
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Use your Ethereum wallet for secure, passwordless authentication
                                </p>
                                <button
                                    onClick={handleWalletLogin}
                                    disabled={isConnecting}
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    {isConnecting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            <Wallet className="w-5 h-5" />
                                            Connect Wallet
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="text-sm text-gray-500 text-center">
                                Don't have MetaMask?{' '}
                                <a
                                    href="https://metamask.io/download/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Download here
                                </a>
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleEmailLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="input-field pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="input-field pl-10 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                    <span className="text-sm text-gray-600">Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 font-medium hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Admin Link */}
                <div className="mt-6 text-center">
                    <Link
                        to="/admin/login"
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        Admin Login →
                    </Link>
                </div>
            </div>
        </div>
    )
}
