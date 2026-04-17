import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Vote,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  MoreVertical,
  Eye,
  CheckCircle,
  Clock,
  X,
  AlertCircle,
  UserPlus,
  Loader2,
} from "lucide-react";
import { useElections, useElectionCount, queryKeys } from "@/hooks/useQueries";
import {
  useCreateElection,
  useAddCandidate,
  useRegisterVoter,
} from "@/hooks/useAdminMutations";
import { formatDateTime } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface Election {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "active" | "upcoming" | "completed" | "draft";
  voterCount: number;
  votesCast: number;
  candidateCount: number;
}

export function AdminElections() {
  const queryClient = useQueryClient();
  const { data: electionsData, isLoading: electionsLoading } = useElections();
  useElectionCount();
  const createElectionMutation = useCreateElection();
  const addCandidateMutation = useAddCandidate();
  const registerVoterMutation = useRegisterVoter();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  // Create Election modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newElectionName, setNewElectionName] = useState("");
  const [newElectionDesc, setNewElectionDesc] = useState("");
  const [newElectionStart, setNewElectionStart] = useState("");
  const [newElectionEnd, setNewElectionEnd] = useState("");

  // Add Candidate modal
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [candidateError, setCandidateError] = useState<string | null>(null);
  const [selectedElectionId, setSelectedElectionId] = useState<number | null>(
    null,
  );
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateParty, setNewCandidateParty] = useState("");

  // Register Voter modal (from elections page)
  const [showRegisterVoterModal, setShowRegisterVoterModal] = useState(false);
  const [voterError, setVoterError] = useState<string | null>(null);
  const [voterSuccess, setVoterSuccess] = useState<string | null>(null);
  const [newVoterAddress, setNewVoterAddress] = useState("");

  useMemo(() => Math.floor(Date.now() / 1000), []);

  const elections: Election[] = (electionsData || []).map((e) => {
    const now = Math.floor(Date.now() / 1000);
    let status: Election["status"] = "draft";
    if (now < e.startTime) status = "upcoming";
    else if (now >= e.startTime && now <= e.endTime && e.isActive)
      status = "active";
    else status = "completed";

    return {
      id: e.id.toString(),
      name: e.name,
      description: e.description,
      startDate: new Date(e.startTime * 1000).toISOString(),
      endDate: new Date(e.endTime * 1000).toISOString(),
      status,
      voterCount: 0,
      votesCast: e.totalVotes,
      candidateCount: e.candidateCount,
    };
  });

  const filteredElections = elections.filter((election) => {
    const matchesSearch = election.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || election.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Returns a datetime-local string (YYYY-MM-DDTHH:MM) for N minutes from now.
  // Used as the `min` attribute so the browser blocks selecting past times.
  const minDateTime = (offsetMinutes = 1) => {
    const d = new Date(Date.now() + offsetMinutes * 60 * 1000);
    // Pad to local time string that datetime-local understands
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate(),
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const openCreateModal = () => {
    setCreateError(null);
    setNewElectionName("");
    setNewElectionDesc("");
    setNewElectionStart("");
    setNewElectionEnd("");
    setShowCreateModal(true);
  };

  const handleCreateElection = async () => {
    if (!newElectionName || !newElectionStart || !newElectionEnd) return;
    setCreateError(null);

    try {
      const parseDateLocal = (value: string) => {
        const [datePart, timePart] = value.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hour, minute, 0, 0).getTime() / 1000;
      };

      const startTimestamp = parseDateLocal(newElectionStart);
      const endTimestamp = parseDateLocal(newElectionEnd);

      if (endTimestamp <= startTimestamp) {
        setCreateError("End date must be after start date");
        return;
      }

      await createElectionMutation.mutateAsync({
        name: newElectionName,
        description: newElectionDesc,
        startTime: startTimestamp,
        endTime: endTimestamp,
      });

      setShowCreateModal(false);
      queryClient.invalidateQueries({ queryKey: queryKeys.electionCount });
      queryClient.invalidateQueries({ queryKey: queryKeys.electionsList });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      // Surface the contract revert reason if present
      const match = msg.match(/reason="([^"]+)"/) || msg.match(/revert: (.+)/);
      setCreateError(match ? match[1] : msg);
    }
  };

  const openAddCandidateModal = (electionId: number) => {
    setSelectedElectionId(electionId);
    setCandidateError(null);
    setNewCandidateName("");
    setNewCandidateParty("");
    setShowAddCandidateModal(true);
    setShowDropdown(null);
  };

  const handleAddCandidate = async () => {
    if (!selectedElectionId || !newCandidateName || !newCandidateParty) return;
    setCandidateError(null);

    try {
      await addCandidateMutation.mutateAsync({
        electionId: selectedElectionId,
        name: newCandidateName,
        party: newCandidateParty,
      });

      setShowAddCandidateModal(false);
      queryClient.invalidateQueries({ queryKey: queryKeys.electionsList });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      const match = msg.match(/reason="([^"]+)"/) || msg.match(/revert: (.+)/);
      setCandidateError(match ? match[1] : msg);
    }
  };

  const openRegisterVoterModal = () => {
    setVoterError(null);
    setVoterSuccess(null);
    setNewVoterAddress("");
    setShowRegisterVoterModal(true);
    setShowDropdown(null);
  };

  const handleRegisterVoter = async () => {
    if (!newVoterAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setVoterError("Please enter a valid Ethereum address (0x...)");
      return;
    }
    setVoterError(null);
    setVoterSuccess(null);

    try {
      await registerVoterMutation.mutateAsync(newVoterAddress);
      setVoterSuccess(`${newVoterAddress} successfully registered as a voter.`);
      setNewVoterAddress("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      const match = msg.match(/reason="([^"]+)"/) || msg.match(/revert: (.+)/);
      setVoterError(match ? match[1] : msg);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 badge-success">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
      case "upcoming":
        return (
          <span className="inline-flex items-center gap-1 badge-info">
            <Clock className="w-3 h-3" />
            Upcoming
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 badge-warning">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            Draft
          </span>
        );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-900 mb-2">
            Elections
          </h1>
          <p className="text-gray-600">Create and manage elections</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={openRegisterVoterModal}
            className="btn-secondary flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Register Voter
          </button>
          <button
            onClick={openCreateModal}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Election
          </button>
        </div>
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
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Election
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Period
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Votes
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Candidates
                </th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredElections.map((election) => (
                <tr
                  key={election.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-primary-900">
                        {election.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {election.description}
                      </div>
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
                      <div className="text-gray-600">
                        {formatDateTime(election.endDate)}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{election.votesCast}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium">
                      {election.candidateCount}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative flex justify-end gap-1">
                      {/* Add Candidate */}
                      <button
                        onClick={() =>
                          openAddCandidateModal(parseInt(election.id))
                        }
                        className="p-2 rounded-lg hover:bg-gray-100 text-green-600 transition-colors"
                        title="Add Candidate"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      {/* Register Voter */}
                      <button
                        onClick={openRegisterVoterModal}
                        className="p-2 rounded-lg hover:bg-gray-100 text-blue-600 transition-colors"
                        title="Register Voter"
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>
                      {/* More actions */}
                      <button
                        onClick={() =>
                          setShowDropdown(
                            showDropdown === election.id ? null : election.id,
                          )
                        }
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>

                      {showDropdown === election.id && (
                        <div className="absolute right-0 top-10 z-10 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48 animate-slide-down">
                          <Link
                            to={`/results/${election.id}`}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                            onClick={() => setShowDropdown(null)}
                          >
                            <Eye className="w-4 h-4" />
                            View Results
                          </Link>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredElections.length === 0 && !electionsLoading && (
          <div className="p-12 text-center">
            <Vote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No elections found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first election to get started"}
            </p>
            <button
              onClick={openCreateModal}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Election
            </button>
          </div>
        )}

        {filteredElections.length === 0 && electionsLoading && (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Loading elections from blockchain…</p>
          </div>
        )}
      </div>

      {/* ── Create Election Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary-900">
                Create New Election
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex gap-2 items-start text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{createError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Election Name *
                </label>
                <input
                  type="text"
                  value={newElectionName}
                  onChange={(e) => setNewElectionName(e.target.value)}
                  placeholder="e.g., Student Council Election 2024"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newElectionDesc}
                  onChange={(e) => setNewElectionDesc(e.target.value)}
                  placeholder="Describe the election…"
                  className="input-field"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={newElectionStart}
                    onChange={(e) => setNewElectionStart(e.target.value)}
                    min={minDateTime()}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={newElectionEnd}
                    onChange={(e) => setNewElectionEnd(e.target.value)}
                    min={newElectionStart || minDateTime()}
                    className="input-field"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Start date must be in the future. Candidates must be added
                before the election starts.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateElection}
                disabled={
                  createElectionMutation.isPending ||
                  !newElectionName ||
                  !newElectionStart ||
                  !newElectionEnd
                }
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {createElectionMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create Election"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Candidate Modal ── */}
      {showAddCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary-900">
                Add Candidate
              </h3>
              <button
                onClick={() => setShowAddCandidateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {candidateError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex gap-2 items-start text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{candidateError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Candidate Name *
                </label>
                <input
                  type="text"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  placeholder="e.g., John Doe"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Party / Affiliation *
                </label>
                <input
                  type="text"
                  value={newCandidateParty}
                  onChange={(e) => setNewCandidateParty(e.target.value)}
                  placeholder="e.g., Independent"
                  className="input-field"
                />
              </div>
              <p className="text-xs text-gray-500">
                Candidates can only be added before the election starts.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddCandidateModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCandidate}
                disabled={
                  addCandidateMutation.isPending ||
                  !newCandidateName ||
                  !newCandidateParty
                }
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {addCandidateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding…
                  </>
                ) : (
                  "Add Candidate"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Register Voter Modal ── */}
      {showRegisterVoterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary-900">
                Register Voter
              </h3>
              <button
                onClick={() => setShowRegisterVoterModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Registering a voter on-chain allows them to cast votes in any
              active election.
            </p>

            {voterError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex gap-2 items-start text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{voterError}</span>
              </div>
            )}

            {voterSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex gap-2 items-start text-green-700">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{voterSuccess}</span>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wallet Address *
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={newVoterAddress}
                onChange={(e) => setNewVoterAddress(e.target.value)}
                className="input-field font-mono"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRegisterVoterModal(false)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
              <button
                onClick={handleRegisterVoter}
                disabled={registerVoterMutation.isPending || !newVoterAddress}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {registerVoterMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering…
                  </>
                ) : (
                  "Register Voter"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
