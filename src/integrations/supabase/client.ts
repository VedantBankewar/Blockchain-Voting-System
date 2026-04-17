import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const auth = {
    // Sign up with email
    signUp: async (email: string, password: string, name: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name }
            }
        })
        return { data, error }
    },

    // Sign in with email
    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { data, error }
    },

    // Sign out
    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    // Get current user
    getUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser()
        return { user, error }
    },

    // Get session
    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession()
        return { session, error }
    },

    // Listen to auth changes
    onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
        return supabase.auth.onAuthStateChange(callback)
    },
}

// Database helper functions
export const db = {
    // Voters
    voters: {
        getAll: async () => {
            const { data, error } = await supabase
                .from('voters')
                .select('*')
                .order('created_at', { ascending: false })
            return { data, error }
        },

        getByWallet: async (walletAddress: string) => {
            const { data, error } = await supabase
                .from('voters')
                .select('*')
                .eq('wallet_address', walletAddress)
                .single()
            return { data, error }
        },

        create: async (voter: { email?: string; wallet_address?: string; is_verified?: boolean }) => {
            const { data, error } = await supabase
                .from('voters')
                .insert(voter)
                .select()
                .single()
            return { data, error }
        },

        verify: async (id: string) => {
            const { data, error } = await supabase
                .from('voters')
                .update({ is_verified: true })
                .eq('id', id)
                .select()
                .single()
            return { data, error }
        },
    },

    // Elections
    elections: {
        getAll: async () => {
            const { data, error } = await supabase
                .from('elections')
                .select('*')
                .order('created_at', { ascending: false })
            return { data, error }
        },

        getById: async (id: string) => {
            const { data, error } = await supabase
                .from('elections')
                .select('*, candidates(*)')
                .eq('id', id)
                .single()
            return { data, error }
        },

        create: async (election: {
            name: string
            description: string
            start_date: string
            end_date: string
            election_code: string
            contract_address?: string
        }) => {
            const { data, error } = await supabase
                .from('elections')
                .insert(election)
                .select()
                .single()
            return { data, error }
        },

        update: async (id: string, updates: Partial<{
            name: string
            description: string
            start_date: string
            end_date: string
            status: string
        }>) => {
            const { data, error } = await supabase
                .from('elections')
                .update(updates)
                .eq('id', id)
                .select()
                .single()
            return { data, error }
        },
    },

    // Candidates
    candidates: {
        getByElection: async (electionId: string) => {
            const { data, error } = await supabase
                .from('candidates')
                .select('*')
                .eq('election_id', electionId)
                .order('created_at', { ascending: true })
            return { data, error }
        },

        create: async (candidate: {
            election_id: string
            name: string
            party: string
            image_url?: string
        }) => {
            const { data, error } = await supabase
                .from('candidates')
                .insert(candidate)
                .select()
                .single()
            return { data, error }
        },
    },

    // Votes
    votes: {
        create: async (vote: {
            voter_id: string
            election_id: string
            candidate_id: string
            tx_hash: string
        }) => {
            const { data, error } = await supabase
                .from('votes')
                .insert(vote)
                .select()
                .single()
            return { data, error }
        },

        hasVoted: async (voterId: string, electionId: string) => {
            const { data, error } = await supabase
                .from('votes')
                .select('id')
                .eq('voter_id', voterId)
                .eq('election_id', electionId)
                .single()
            return { hasVoted: !!data, error }
        },

        getByElection: async (electionId: string) => {
            const { data, error } = await supabase
                .from('votes')
                .select('*, candidates(name, party)')
                .eq('election_id', electionId)
            return { data, error }
        },
    },
}
