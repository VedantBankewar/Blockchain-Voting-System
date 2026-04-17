# Supabase Database Setup Guide

This guide will help you set up Supabase as the backend database for BlockVote.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** and sign up with GitHub or email
3. Create a new organization (or use existing)

## Step 2: Create a New Project

1. Click **"New Project"**
2. Fill in:
   - **Name**: `blockvote` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose the closest to your users
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be ready

## Step 3: Get Your API Keys

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhb...` (long string)

## Step 4: Configure Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 5: Create Database Tables

Go to **SQL Editor** in Supabase and run this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- VOTERS TABLE
-- =====================
CREATE TABLE voters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  wallet_address VARCHAR(42) UNIQUE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_voters_wallet ON voters(wallet_address);
CREATE INDEX idx_voters_email ON voters(email);

-- =====================
-- ELECTIONS TABLE
-- =====================
CREATE TABLE elections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'active', 'completed')),
  election_code VARCHAR(10) UNIQUE NOT NULL,
  contract_address VARCHAR(42),
  created_by UUID REFERENCES voters(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for election code lookups
CREATE INDEX idx_elections_code ON elections(election_code);

-- =====================
-- CANDIDATES TABLE
-- =====================
CREATE TABLE candidates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  party VARCHAR(255),
  image_url TEXT,
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for election candidates
CREATE INDEX idx_candidates_election ON candidates(election_id);

-- =====================
-- VOTES TABLE
-- =====================
CREATE TABLE votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  voter_id UUID REFERENCES voters(id),
  election_id UUID REFERENCES elections(id),
  candidate_id UUID REFERENCES candidates(id),
  tx_hash VARCHAR(66) NOT NULL, -- Ethereum transaction hash
  vote_hash VARCHAR(66), -- Vote verification hash from contract
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one vote per voter per election
  UNIQUE(voter_id, election_id)
);

-- Create indexes for vote lookups
CREATE INDEX idx_votes_election ON votes(election_id);
CREATE INDEX idx_votes_voter ON votes(voter_id);
CREATE INDEX idx_votes_tx ON votes(tx_hash);

-- =====================
-- FUNCTIONS
-- =====================

-- Function to update election status automatically
CREATE OR REPLACE FUNCTION update_election_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.start_date <= NOW() AND NEW.end_date > NOW() THEN
    NEW.status := 'active';
  ELSIF NEW.end_date <= NOW() THEN
    NEW.status := 'completed';
  ELSIF NEW.start_date > NOW() THEN
    NEW.status := 'upcoming';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update status
CREATE TRIGGER election_status_trigger
BEFORE INSERT OR UPDATE ON elections
FOR EACH ROW EXECUTE FUNCTION update_election_status();

-- Function to increment vote count
CREATE OR REPLACE FUNCTION increment_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE candidates 
  SET vote_count = vote_count + 1 
  WHERE id = NEW.candidate_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment vote count on new vote
CREATE TRIGGER vote_count_trigger
AFTER INSERT ON votes
FOR EACH ROW EXECUTE FUNCTION increment_vote_count();

-- =====================
-- ROW LEVEL SECURITY (RLS)
-- =====================

-- Enable RLS on all tables
ALTER TABLE voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Voters policies
CREATE POLICY "Voters can read their own data" ON voters
  FOR SELECT USING (auth.uid()::text = id::text OR is_admin = true);

CREATE POLICY "Anyone can create a voter" ON voters
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update voters" ON voters
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM voters WHERE id::text = auth.uid()::text AND is_admin = true)
  );

-- Elections policies (public read, admin write)
CREATE POLICY "Anyone can read elections" ON elections
  FOR SELECT USING (true);

CREATE POLICY "Admins can create elections" ON elections
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM voters WHERE id::text = auth.uid()::text AND is_admin = true)
  );

CREATE POLICY "Admins can update elections" ON elections
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM voters WHERE id::text = auth.uid()::text AND is_admin = true)
  );

-- Candidates policies (public read, admin write)
CREATE POLICY "Anyone can read candidates" ON candidates
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage candidates" ON candidates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM voters WHERE id::text = auth.uid()::text AND is_admin = true)
  );

-- Votes policies
CREATE POLICY "Voters can read their own votes" ON votes
  FOR SELECT USING (voter_id::text = auth.uid()::text);

CREATE POLICY "Verified voters can vote" ON votes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM voters WHERE id = voter_id AND is_verified = true)
  );

-- =====================
-- SEED DATA (Optional)
-- =====================

-- Create admin user (update email after signup)
-- INSERT INTO voters (email, is_admin, is_verified) 
-- VALUES ('admin@blockvote.io', true, true);

-- Create sample election
-- INSERT INTO elections (name, description, start_date, end_date, election_code, status)
-- VALUES (
--   'Demo Election 2024',
--   'A demonstration election for testing',
--   NOW() + INTERVAL '1 hour',
--   NOW() + INTERVAL '7 days',
--   'DEMO2024',
--   'upcoming'
-- );
```

## Step 6: Enable Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be on by default)
3. Optionally configure:
   - **Site URL**: `http://localhost:5174` (for development)
   - **Redirect URLs**: Add your production URL when deploying

## Step 7: Test the Connection

1. Restart your development server to load the new environment variables
2. Try registering a new account
3. Check the **Table Editor** in Supabase to see if the voter was created

## Database Schema Diagram

```
┌─────────────────┐       ┌─────────────────┐
│     voters      │       │    elections    │
├─────────────────┤       ├─────────────────┤
│ id (UUID) PK    │       │ id (UUID) PK    │
│ email           │       │ name            │
│ wallet_address  │       │ description     │
│ is_verified     │       │ start_date      │
│ is_admin        │       │ end_date        │
│ created_at      │       │ status          │
└────────┬────────┘       │ election_code   │
         │                │ contract_address│
         │                │ created_by FK   │
         │                └────────┬────────┘
         │                         │
         │    ┌────────────────────┘
         │    │
         ▼    ▼
┌─────────────────┐       ┌─────────────────┐
│      votes      │       │   candidates    │
├─────────────────┤       ├─────────────────┤
│ id (UUID) PK    │       │ id (UUID) PK    │
│ voter_id FK     │◄──────│ election_id FK  │
│ election_id FK  │       │ name            │
│ candidate_id FK │───────│ party           │
│ tx_hash         │       │ image_url       │
│ vote_hash       │       │ vote_count      │
│ voted_at        │       │ created_at      │
└─────────────────┘       └─────────────────┘
```

## Troubleshooting

### "Invalid API key"
- Double-check your `.env` file values
- Make sure you're using the **anon** key, not the **service_role** key
- Restart the dev server after changing `.env`

### "Row level security policy violation"
- Make sure you're authenticated before making requests
- Check that the user has the required permissions

### "Table doesn't exist"
- Run the SQL setup script in the SQL Editor
- Make sure there are no syntax errors

## Next Steps

1. Set up production environment variables
2. Configure email templates for auth emails
3. Add custom domains for production
4. Set up database backups
