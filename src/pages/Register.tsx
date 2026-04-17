import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Vote,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Wallet,
    User,
    AlertCircle,
    Loader2,
    CheckCircle
} from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { auth, db } from '@/integrations/supabase/client'

export function Register() {
    const navigate = useNavigate()
    const { connect, isConnected, isConnecting, address } = useWallet()

    const [registerMethod, setRegisterMethod] = useState<'email' | 'wallet'>('wallet')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [step, setStep] = useState<'form' | 'wallet-connect' | 'success'>('form')

    const handleEmailRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setIsLoading(true)

        try {
            const { error: signUpError } = await auth.signUp(email, password, name)
            if (signUpError) throw new Error(signUpError.message)

            // Create voter profile in Supabase
            await db.voters.create({
                email,
                is_verified: false,
            })

            setStep('wallet-connect')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleWalletRegister = async () => {
        setError(null)
        try {
            await connect()
            if (isConnected && address) {
                // Check if wallet is already registered
                const { data } = await db.voters.getByWallet(address)

                if (!data) {
                    // Create voter profile for new wallet user
                    await db.voters.create({
                        wallet_address: address,
                        is_verified: false,
                    })
                }

                setStep('success')
                setTimeout(() => navigate('/dashboard'), 2000)
            }
        } catch {
            setError('Failed to connect wallet. Please try again.')
        }
    }

    const skipWalletConnect = () => {
        setStep('success')
        setTimeout(() => navigate('/dashboard'), 2000)
    }

    if (step === 'success') {
        return (
            <div className="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full text-center">
                    <div className="glass-card p-12">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-blue-900 mb-4">
                            Registration Successful!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Your account has been created. Redirecting to dashboard...
                        </p>
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
                    </div>
                </div>
            </div>
        )
    }

    if (step === 'wallet-connect') {
        return (
            <div className="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full">
                    <div className="glass-card p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Wallet className="w-8 h-8 text-blue-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-blue-900 mb-2">
                                Connect Your Wallet
                            </h1>
                            <p className="text-gray-600">
                                Link your Ethereum wallet for secure voting
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                <div className="flex gap-2 items-center text-red-700">
                                    <AlertCircle className="w-5 h-5" />
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={handleWalletRegister}
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
                                        Connect MetaMask
                                    </>
                                )}
                            </button>

                            <button
                                onClick={skipWalletConnect}
                                className="btn-secondary w-full"
                            >
                                Skip for Now
                            </button>
                        </div>

                        <p className="mt-6 text-sm text-gray-500 text-center">
                            You can connect your wallet later from your dashboard
                        </p>
                    </div>
                </div>
            </div>
        )
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

                {/* Register Card */}
                <div className="glass-card p-8">
                    <h1 className="text-2xl font-bold text-center text-blue-900 mb-2">
                        Create Account
                    </h1>
                    <p className="text-gray-600 text-center mb-8">
                        Join BlockVote to participate in secure elections
                    </p>

                    {/* Register Method Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setRegisterMethod('wallet')}
                            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${registerMethod === 'wallet'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Wallet className="w-5 h-5 inline-block mr-2" />
                            Wallet
                        </button>
                        <button
                            onClick={() => setRegisterMethod('email')}
                            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${registerMethod === 'email'
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

                    {registerMethod === 'wallet' ? (
                        <div className="space-y-6">
                            <div className="bg-blue-50 rounded-xl p-6 text-center">
                                <Wallet className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="font-semibold text-blue-900 mb-2">
                                    Quick Sign Up with Wallet
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Connect your MetaMask wallet to create an account instantly
                                </p>
                                <button
                                    onClick={handleWalletRegister}
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
                                            Connect & Sign Up
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>No password needed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Secure blockchain authentication</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Ready to vote immediately</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleEmailRegister} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="input-field pl-10"
                                        required
                                    />
                                </div>
                            </div>

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
                                        minLength={8}
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="input-field pl-10"
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <input type="checkbox" className="rounded border-gray-300 mt-1" required />
                                <span className="text-sm text-gray-600">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
