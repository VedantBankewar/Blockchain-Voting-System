import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Shield,
    Mail,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    Loader2
} from 'lucide-react'

export function AdminLogin() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            // TODO: Implement Supabase admin authentication
            // Check if user has admin role

            // Demo admin credentials check
            if (email === 'admin@blockvote.io' && password === 'admin123') {
                await new Promise(resolve => setTimeout(resolve, 1000))
                navigate('/admin')
            } else {
                throw new Error('Invalid credentials')
            }
        } catch (err) {
            setError('Invalid admin credentials')
        } finally {
            setIsLoading(false)
        }
    }

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
                        Sign in to manage elections and voters
                    </p>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
                            <div className="flex gap-2 items-center text-red-200">
                                <AlertCircle className="w-5 h-5" />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Admin Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@blockvote.io"
                                    className="w-full px-4 py-3 pl-10 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 pl-10 pr-10 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-6 bg-white text-blue-700 font-semibold rounded-xl shadow-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2"
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

                    <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                        <p className="text-sm text-yellow-200">
                            <strong>Demo Credentials:</strong><br />
                            Email: admin@blockvote.io<br />
                            Password: admin123
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <Link to="/login" className="text-gray-300 hover:text-white">
                            ← Back to User Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
