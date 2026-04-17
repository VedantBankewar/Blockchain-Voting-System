import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Vote,
    Plus,
    Search,
    Filter,
    Calendar,
    Users,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    Clock,
    AlertCircle
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface Election {
    id: string
    name: string
    description: string
    startDate: string
    endDate: string
    status: 'active' | 'upcoming' | 'completed' | 'draft'
    voterCount: number
    votesCast: number
    candidateCount: number
}

const demoElections: Election[] = [
    {
        id: '1',
        name: 'Student Council Election 2024',
        description: 'Annual election for student council representatives',
        startDate: new Date(Date.now() - 86400000).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 6).toISOString(),
        status: 'active',
        voterCount: 500,
        votesCast: 234,
        candidateCount: 4,
    },
    {
        id: '2',
        name: 'Board Member Selection',
        description: 'Selection of new board members for 2024',
        startDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 9).toISOString(),
        status: 'upcoming',
        voterCount: 150,
        votesCast: 0,
        candidateCount: 6,
    },
    {
        id: '3',
        name: 'Community Project Vote',
        description: 'Vote on the next community improvement project',
        startDate: new Date(Date.now() - 86400000 * 14).toISOString(),
        endDate: new Date(Date.now() - 86400000 * 7).toISOString(),
        status: 'completed',
        voterCount: 800,
        votesCast: 654,
        candidateCount: 5,
    },
]

export function AdminElections() {
    const [elections, setElections] = useState<Election[]>(demoElections)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [showDropdown, setShowDropdown] = useState<string | null>(null)

    const filteredElections = elections.filter(election => {
        const matchesSearch = election.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || election.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1 badge-success">
                        <CheckCircle className="w-3 h-3" />
                        Active
                    </span>
                )
            case 'upcoming':
                return (
                    <span className="inline-flex items-center gap-1 badge-info">
                        <Clock className="w-3 h-3" />
                        Upcoming
                    </span>
                )
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1 badge-warning">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                    </span>
                )
            case 'draft':
                return (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        Draft
                    </span>
                )
            default:
                return null
        }
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900 mb-2">Elections</h1>
                    <p className="text-gray-600">Create and manage elections</p>
                </div>
                <Link
                    to="/admin/elections/new"
                    className="mt-4 md:mt-0 btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create Election
                </Link>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search elections..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input-field w-40"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Elections Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Election</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Period</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Votes</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Candidates</th>
                                <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredElections.map((election) => (
                                <tr key={election.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div>
                                            <div className="font-semibold text-primary-900">{election.name}</div>
                                            <div className="text-sm text-gray-500">{election.description}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        {getStatusBadge(election.status)}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                {formatDateTime(election.startDate)}
                                            </div>
                                            <div className="text-gray-400">to</div>
                                            <div className="text-gray-600">{formatDateTime(election.endDate)}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium">{election.votesCast}</span>
                                            <span className="text-gray-400">/ {election.voterCount}</span>
                                        </div>
                                        <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                                            <div
                                                className="h-full bg-primary-600 rounded-full"
                                                style={{ width: `${(election.votesCast / election.voterCount) * 100}%` }}
                                            />
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="font-medium">{election.candidateCount}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="relative flex justify-end">
                                            <button
                                                onClick={() => setShowDropdown(showDropdown === election.id ? null : election.id)}
                                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <MoreVertical className="w-5 h-5 text-gray-500" />
                                            </button>

                                            {showDropdown === election.id && (
                                                <div className="absolute right-0 top-10 z-10 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48 animate-slide-down">
                                                    <Link
                                                        to={`/admin/elections/${election.id}`}
                                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View Details
                                                    </Link>
                                                    <Link
                                                        to={`/admin/elections/${election.id}/edit`}
                                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Edit
                                                    </Link>
                                                    <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full">
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredElections.length === 0 && (
                    <div className="p-12 text-center">
                        <Vote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No elections found</h3>
                        <p className="text-gray-500 mb-4">
                            {searchQuery || statusFilter !== 'all'
                                ? 'Try adjusting your filters'
                                : 'Create your first election to get started'}
                        </p>
                        <Link to="/admin/elections/new" className="btn-primary inline-flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Create Election
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
