import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    Vote,
    Users,
    BarChart3,
    Settings,
    Plus,
    ChevronRight,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'

export function AdminDashboard() {
    const location = useLocation()
    const { isConnected, address, connect } = useWallet()

    const sidebarItems = [
        { name: 'Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'Elections', path: '/admin/elections', icon: Vote },
        { name: 'Voters', path: '/admin/voters', icon: Users },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ]

    const isActive = (path: string) => location.pathname === path

    const stats = [
        { label: 'Total Elections', value: '12', icon: Vote, trend: '+2 this month', color: 'primary' },
        { label: 'Active Elections', value: '3', icon: Clock, trend: '2 ending soon', color: 'green' },
        { label: 'Registered Voters', value: '1,248', icon: Users, trend: '+156 new', color: 'blue' },
        { label: 'Total Votes Cast', value: '8,432', icon: TrendingUp, trend: '+1,234 today', color: 'purple' },
    ]

    const recentActivity = [
        { type: 'vote', message: 'New vote cast in Student Council Election', time: '2 minutes ago' },
        { type: 'register', message: 'New voter registered: 0x1a2b...3c4d', time: '15 minutes ago' },
        { type: 'election', message: 'Board Member Selection created', time: '1 hour ago' },
        { type: 'vote', message: '50 votes milestone in Community Project Vote', time: '3 hours ago' },
    ]

    if (!isConnected) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-gradient-section">
                <div className="glass-card p-12 max-w-md text-center">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Settings className="w-10 h-10 text-primary-700" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary-900 mb-4">
                        Admin Access Required
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Please connect your admin wallet to access the admin panel.
                    </p>
                    <button onClick={connect} className="btn-primary w-full">
                        Connect Wallet
                    </button>
                </div>
            </div>
        )
    }

    // If we're on a sub-route, show the Outlet
    if (location.pathname !== '/admin') {
        return (
            <div className="min-h-screen bg-gradient-section">
                <div className="flex">
                    {/* Sidebar */}
                    <aside className="sidebar">
                        <nav className="space-y-2">
                            {sidebarItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={isActive(item.path) ? 'sidebar-item-active' : 'sidebar-item'}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 ml-64 p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-section">
            <div className="flex">
                {/* Sidebar */}
                <aside className="sidebar">
                    <nav className="space-y-2">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={isActive(item.path) ? 'sidebar-item-active' : 'sidebar-item'}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-64 p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-primary-900 mb-2">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-600">
                                Manage elections, voters, and view analytics
                            </p>
                        </div>
                        <Link
                            to="/admin/elections/new"
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create Election
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`glass-card p-6 border-l-4 ${stat.color === 'primary' ? 'border-primary-600' :
                                        stat.color === 'green' ? 'border-green-600' :
                                            stat.color === 'blue' ? 'border-blue-600' :
                                                'border-purple-600'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <p className="text-3xl font-bold text-primary-900 mt-1">
                                            {stat.value}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">{stat.trend}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.color === 'primary' ? 'bg-primary-100' :
                                            stat.color === 'green' ? 'bg-green-100' :
                                                stat.color === 'blue' ? 'bg-blue-100' :
                                                    'bg-purple-100'
                                        }`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color === 'primary' ? 'text-primary-600' :
                                                stat.color === 'green' ? 'text-green-600' :
                                                    stat.color === 'blue' ? 'text-blue-600' :
                                                        'text-purple-600'
                                            }`} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Quick Actions */}
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-bold text-primary-900 mb-4">Quick Actions</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Link
                                    to="/admin/elections/new"
                                    className="glass-card-hover p-6 flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                        <Plus className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-primary-900">Create Election</h3>
                                        <p className="text-sm text-gray-500">Set up a new election</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </Link>

                                <Link
                                    to="/admin/voters"
                                    className="glass-card-hover p-6 flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <Users className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-primary-900">Manage Voters</h3>
                                        <p className="text-sm text-gray-500">Register and verify voters</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </Link>

                                <Link
                                    to="/admin/elections"
                                    className="glass-card-hover p-6 flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Vote className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-primary-900">View Elections</h3>
                                        <p className="text-sm text-gray-500">Manage existing elections</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </Link>

                                <Link
                                    to="/admin/analytics"
                                    className="glass-card-hover p-6 flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <BarChart3 className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-primary-900">View Analytics</h3>
                                        <p className="text-sm text-gray-500">Detailed voting statistics</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                            <h2 className="text-xl font-bold text-primary-900 mb-4">Recent Activity</h2>
                            <div className="glass-card p-6">
                                <div className="space-y-4">
                                    {recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'vote' ? 'bg-green-100' :
                                                    activity.type === 'register' ? 'bg-blue-100' :
                                                        'bg-primary-100'
                                                }`}>
                                                {activity.type === 'vote' ? (
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                ) : activity.type === 'register' ? (
                                                    <Users className="w-4 h-4 text-blue-600" />
                                                ) : (
                                                    <Vote className="w-4 h-4 text-primary-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-700">{activity.message}</p>
                                                <p className="text-xs text-gray-400">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
