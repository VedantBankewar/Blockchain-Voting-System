# BlockVote - Blockchain-Based Voting System

A decentralized voting platform built on the Ethereum blockchain that enables secure, transparent, and tamper-proof elections. The system combines a Solidity smart contract for on-chain vote recording with a modern React frontend and Supabase backend for user management.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Supabase Setup](#supabase-setup)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [Smart Contract Details](#smart-contract-details)
- [Environment Variables](#environment-variables)
- [Build & Deployment](#build--deployment)
- [Known Issues](#known-issues)
- [License](#license)

## Features

### Voter Features
- **Wallet Authentication** - Connect via MetaMask for passwordless login
- **Email Authentication** - Alternative sign-up/login via Supabase Auth
- **Voter Dashboard** - View active, upcoming, and completed elections
- **Cast Votes** - Select candidates and submit votes as blockchain transactions
- **Vote Receipts** - Receive cryptographic vote hash for independent verification
- **View Results** - Real-time election results with vote percentages and rankings

### Admin Features
- **Admin Dashboard** - Overview of elections, voters, and platform statistics
- **Create Elections** - Set up elections with name, description, and time period
- **Add Candidates** - Register candidates with name and party affiliation
- **Manage Voters** - Register wallet addresses as eligible voters (on-chain)
- **Voter Verification** - Verify voters in Supabase for off-chain tracking

### Security Features
- **Immutable Vote Storage** - All votes recorded permanently on Ethereum blockchain
- **One Vote Per Voter** - Smart contract enforces single vote per election per address
- **Role-Based Access** - Owner/admin/voter roles enforced at the contract level
- **Vote Verification** - Voters can verify their vote using the transaction hash
- **Registered Voters Only** - Only admin-registered addresses can cast votes

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, React Router v7, TanStack React Query |
| **Styling** | Tailwind CSS 3, custom glass-morphism design system |
| **Blockchain** | Solidity 0.8.19, Ethers.js v6, Hardhat |
| **Backend/Auth** | Supabase (PostgreSQL, Auth, Row Level Security) |
| **Wallet** | MetaMask integration |
| **Build** | Vite 7, ESLint, TypeScript compiler |
| **Icons** | Lucide React |

## Architecture

```
                    ┌─────────────────────────────────────┐
                    │          React Frontend              │
                    │  (Vite + TypeScript + Tailwind CSS)  │
                    └───────────┬───────────┬──────────────┘
                                │           │
                    ┌───────────▼───┐   ┌───▼──────────────┐
                    │   MetaMask    │   │    Supabase       │
                    │   Wallet      │   │  (Auth + DB)      │
                    └───────────┬───┘   └──────────────────┘
                                │
                    ┌───────────▼──────────────────────────┐
                    │   Ethereum Blockchain                 │
                    │   (Hardhat Local / Sepolia Testnet)   │
                    │                                       │
                    │   ┌─────────────────────────────┐    │
                    │   │     VotingContract.sol       │    │
                    │   │  - Election Management       │    │
                    │   │  - Candidate Registration     │    │
                    │   │  - Vote Casting & Receipts    │    │
                    │   │  - Role-Based Access Control  │    │
                    │   └─────────────────────────────┘    │
                    └──────────────────────────────────────┘
```

**Data Flow:**
- **Votes** are recorded on-chain via the smart contract (source of truth)
- **User accounts & voter profiles** are managed in Supabase
- **Election data** is read directly from the smart contract
- **Authentication** supports both MetaMask wallet and email/password via Supabase Auth

## Project Structure

```
├── contracts/
│   └── VotingContract.sol          # Solidity smart contract
├── scripts/
│   ├── deploy.cjs                  # Hardhat deployment script (with demo data)
│   └── deploy.js                   # Alternate deployment script
├── docs/
│   └── SUPABASE_SETUP.md           # Supabase database setup guide
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Layout.tsx          # Main layout with navbar + footer
│   │   │   ├── Navbar.tsx          # Navigation bar with wallet connection
│   │   │   └── Footer.tsx          # Site footer
│   │   └── ui/
│   │       └── States.tsx          # Reusable loading/error/empty states
│   ├── contexts/
│   │   └── AuthContext.tsx          # Supabase auth context provider
│   ├── hooks/
│   │   ├── useWallet.ts            # MetaMask wallet connection hook
│   │   ├── useContract.ts          # Smart contract interaction hook
│   │   ├── useQueries.ts           # TanStack Query hooks for contract reads
│   │   └── useAdminMutations.ts    # TanStack Mutation hooks for admin actions
│   ├── integrations/
│   │   └── supabase/
│   │       └── client.ts           # Supabase client, auth helpers, and DB API
│   ├── lib/
│   │   ├── ethereum.ts             # Contract ABI, address, chain config
│   │   └── utils.ts                # Utility functions (formatting, etc.)
│   ├── pages/
│   │   ├── Home.tsx                # Landing page with hero, features, CTA
│   │   ├── HowItWorks.tsx          # How-it-works guide + FAQ
│   │   ├── Security.tsx            # Security features & audit info
│   │   ├── Login.tsx               # Voter login (wallet or email)
│   │   ├── Register.tsx            # Voter registration
│   │   ├── Dashboard.tsx           # Voter dashboard with election list
│   │   ├── Vote.tsx                # Voting page (select, confirm, submit)
│   │   ├── Results.tsx             # Election results with charts
│   │   └── Admin/
│   │       ├── Login.tsx           # Admin login page
│   │       ├── Dashboard.tsx       # Admin dashboard with sidebar
│   │       ├── Elections.tsx       # Election management (CRUD + candidates)
│   │       └── Voters.tsx          # Voter management (register + verify)
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── App.tsx                     # Root component with routes
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Tailwind + custom design system
├── hardhat.config.cjs              # Hardhat configuration
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies and scripts
└── index.html                      # HTML entry point
```

## Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**
- **MetaMask** browser extension
- **Supabase** account (free tier works)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "Blockchain based voting system"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials (see [Environment Variables](#environment-variables)).

## Smart Contract Deployment

### Local Development (Hardhat)

1. **Start the Hardhat local node:**
   ```bash
   npx hardhat node
   ```

2. **Deploy the contract** (in a new terminal):
   ```bash
   npx hardhat run scripts/deploy.cjs --network localhost
   ```
   This deploys the contract and creates a demo election with 3 candidates.

3. **Update the contract address** in `src/lib/ethereum.ts`:
   ```typescript
   export const VOTING_CONTRACT_ADDRESS = '<deployed-address>'
   ```

4. **Import Hardhat accounts into MetaMask:**
   - Network: `http://127.0.0.1:8545` (Chain ID: 31337)
   - Import the first account private key printed by `npx hardhat node`

### Sepolia Testnet

To deploy to Sepolia, add your deployer private key and Infura/Alchemy RPC URL to `hardhat.config.cjs` and run:
```bash
npx hardhat run scripts/deploy.cjs --network sepolia
```

## Supabase Setup

Follow the detailed guide in [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md). In summary:

1. Create a Supabase project
2. Run the SQL schema (creates `voters`, `elections`, `candidates`, `votes` tables)
3. Enable email authentication
4. Copy Project URL and anon key to your `.env` file

### Database Schema

| Table | Purpose |
|-------|---------|
| `voters` | User profiles, wallet addresses, verification status |
| `elections` | Election metadata (synced with on-chain data) |
| `candidates` | Candidate info per election |
| `votes` | Vote records with transaction hashes |

## Running the Application

```bash
# Start Hardhat local node (terminal 1)
npx hardhat node

# Deploy contract (terminal 2)
npx hardhat run scripts/deploy.cjs --network localhost

# Start dev server (terminal 3)
npm run dev
```

The app runs at `http://localhost:5173`.

## Usage Guide

### As a Voter

1. **Connect Wallet** - Click "Connect Wallet" and approve in MetaMask
2. **Register** - If new, you'll be redirected to register (or use email sign-up)
3. **Get Verified** - An admin must register your wallet address on-chain
4. **Vote** - Go to Dashboard, select an active election, choose a candidate, confirm and sign the transaction
5. **Verify** - Save your vote hash/transaction hash to verify on the blockchain

### As an Admin

1. **Login** - Go to `/admin/login` and connect with the contract owner's wallet
2. **Create Election** - Admin Dashboard > Elections > Create Election (sets name, description, time period)
3. **Add Candidates** - Click "+" next to an election to add candidates
4. **Register Voters** - Admin Dashboard > Voters > Add Voter (enter wallet address)
5. **Monitor** - View real-time vote counts in the Results page

## Smart Contract Details

**Contract:** `VotingContract.sol` (Solidity ^0.8.19)

### Roles
| Role | Permissions |
|------|------------|
| **Owner** | Full access: add/remove admins, all admin actions |
| **Admin** | Create elections, add candidates, register voters, end elections |
| **Registered Voter** | Cast one vote per election during the active period |

### Key Functions
| Function | Access | Description |
|----------|--------|-------------|
| `createElection()` | Admin | Create a new election with time bounds |
| `addCandidate()` | Admin | Add candidate to an election (before it starts) |
| `registerVoter()` | Admin | Register a wallet address as eligible voter |
| `castVote()` | Voter | Cast a vote (emits VoteCast event with vote hash) |
| `getElection()` | Public | Read election details |
| `getAllCandidates()` | Public | Get all candidates for an election |
| `checkVoted()` | Public | Check if an address has voted |
| `getVoteReceipt()` | Public | Get vote receipt for verification |
| `verifyVote()` | Public | Verify a vote using its hash |

### Events
- `ElectionCreated` - New election created
- `CandidateAdded` - Candidate added to election
- `VoteCast` - Vote recorded (includes vote hash)
- `VoterRegistered` - New voter registered
- `ElectionEnded` - Election ended early by admin

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public API key |

## Build & Deployment

```bash
# Type-check and build for production
npm run build

# Preview the production build
npm run preview

# Lint the codebase
npm run lint
```

The production build outputs to the `dist/` directory and can be deployed to any static hosting platform (Vercel, Netlify, GitHub Pages, etc.).

## Supported Networks

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Hardhat Local | 31337 | `http://127.0.0.1:8545` |
| Sepolia Testnet | 11155111 | `https://sepolia.infura.io/v3/<key>` |

## Known Issues

- **ESLint warnings:** `Date.now()` usage in `useMemo` triggers `react-hooks/purity` lint errors in `Dashboard.tsx` and `Admin/Elections.tsx`. This is used for calculating election status at render time and does not cause functional issues.
- **Unused variable:** `now` in `Admin/Elections.tsx:59` is declared but shadowed inside the `.map()` callback.
- **Large bundle size:** The production JS bundle exceeds 500 KB. Consider code-splitting with dynamic `import()` for route-level lazy loading.
- **Node.js compatibility:** Hardhat may show a warning on Node.js v22+. Use Node.js 18 or 20 for Hardhat operations if you encounter issues.

## License

This project is private and not licensed for redistribution.
