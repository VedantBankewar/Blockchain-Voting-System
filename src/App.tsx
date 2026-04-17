import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '@/components/Layout/Layout'
import { Home } from '@/pages/Home'
import { HowItWorks } from '@/pages/HowItWorks'
import { Security } from '@/pages/Security'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Dashboard } from '@/pages/Dashboard'
import { VotePage } from '@/pages/Vote'
import { Results } from '@/pages/Results'
import { AdminDashboard } from '@/pages/Admin/Dashboard'
import { AdminElections } from '@/pages/Admin/Elections'
import { AdminVoters } from '@/pages/Admin/Voters'
import { AdminLogin } from '@/pages/Admin/Login'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes (No Layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Main Routes with Layout */}
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/security" element={<Security />} />

            {/* Voter Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vote/:electionId" element={<VotePage />} />
            <Route path="/results/:electionId" element={<Results />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />}>
              <Route path="elections" element={<AdminElections />} />
              <Route path="voters" element={<AdminVoters />} />
            </Route>
            <Route path="/admin/elections" element={<AdminDashboard />} />
            <Route path="/admin/voters" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
