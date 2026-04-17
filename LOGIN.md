****# BlockVote — Login & Setup Guide

Here's the complete step-by-step process from scratch:

---

## Step 1 — Install MetaMask

1. Open your browser (Chrome/Firefox/Brave)
2. Go to **https://metamask.io/download/**
3. Click **"Install MetaMask for Chrome"** (or your browser)
4. Click **"Add to Chrome"** → **"Add Extension"**
5. MetaMask icon appears in your toolbar — click it
6. Click **"Create a new wallet"** → set a password → save the recovery phrase somewhere safe
7. MetaMask is now installed

---

## Step 2 — Add Hardhat Local Network to MetaMask

1. Open MetaMask (click the fox icon in toolbar)
2. At the top, click the network dropdown (it says **"Ethereum Mainnet"**)
3. Click **"Add a custom network"** (at the bottom)
4. Fill in these exact values:

| Field | Value |
|-------|-------|
| Network name | `Hardhat Local` |
| New RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency symbol | `ETH` |
| Block explorer URL | *(leave empty)* |

5. Click **"Save"**
6. Now select **"Hardhat Local"** from the network dropdown — you'll see it selected at the top

---

## Step 3 — Import the Admin Account into MetaMask

1. In MetaMask, click the **circle icon** (top right of the popup, next to the network)
2. Click **"Add account or hardware wallet"**
3. Click **"Import account"**
4. In the **"Enter your private key string"** box, paste:
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
5. Click **"Import"**
6. You'll see a new account named **"Account 2"** with address `0xf39F...2266`
7. Rename it: click the 3 dots → **"Account details"** → click the pencil → type `BlockVote Admin` → Save

---

## Step 4 — Import the Voter Account into MetaMask

1. Repeat the same steps as above
2. Click circle icon → **"Add account or hardware wallet"** → **"Import account"**
3. Paste this private key:
   ```
   0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
   ```
4. Click **"Import"**
5. Rename it to `BlockVote Voter`

You now have 3 accounts in MetaMask. Switch between them using the circle icon.

---

## Step 5 — Open the Project in Terminal

Open **3 separate terminal windows** in your project folder. You can do this in VS Code by pressing `` Ctrl+` `` three times, or open 3 Command Prompt / PowerShell windows and `cd` into the project:

```bash
cd "D:/Blockchain based voting system"
```

Do this in all 3 terminals.

---

## Step 6 — Terminal 1: Start the Blockchain

In **Terminal 1**, run:

```bash
npx hardhat node
```

You'll see output like:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
...
```

**Leave this terminal running.** Do NOT close it — it's your local blockchain.

---

## Step 7 — Terminal 2: Deploy Contract & Set Up Demo Data

In **Terminal 2**, run:

```bash
node scripts/setup_demo.mjs
```

You'll see:
```
✓ Contract deployed
✓ Election created, id: 2
  ✓ Alice Johnson — Progressive Party
  ✓ Bob Smith — Unity Party
  ✓ Carol Williams — Innovation Alliance
✓ Test voter registered
✓ VOTE SUCCESSFULLY REGISTERED ON BLOCKCHAIN
```

This script:
- Verifies the contract is on the blockchain
- Creates a demo election with 3 candidates
- Registers the voter accounts
- Casts a test vote to confirm everything works

---

## Step 8 — Terminal 3: Start the Frontend

In **Terminal 3**, run:

```bash
npm run dev
```

You'll see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Open your browser and go to **http://localhost:5173**

---

## Step 9 — Using the App as Admin

1. In MetaMask, switch to the **"BlockVote Admin"** account (`0xf39F...2266`)
2. Make sure the network is set to **"Hardhat Local"**
3. In the browser, go to **http://localhost:5173/admin/login**
4. Click **"Sign In"** (it will prompt MetaMask to connect)
5. MetaMask popup appears → click **"Connect"**
6. You're now in the **Admin Dashboard**

### What you can do as Admin:
- **Create Elections** — Click "Elections" in the sidebar → "Create Election" button
- **Add Candidates** — Click the `+` icon next to any election row
- **Register Voters** — Click "Voters" in the sidebar → "Add Voter" → paste a wallet address
- **View Results** — Click "View Results" from the elections dropdown

---

## Step 10 — Using the App as a Voter

1. In MetaMask, switch to the **"BlockVote Voter"** account (`0x7099...79C8`)
2. Make sure the network is **"Hardhat Local"**
3. Go to **http://localhost:5173/login**
4. Click the **"Wallet"** tab (already selected by default)
5. Click **"Connect Wallet"**
6. MetaMask popup → click **"Connect"**
7. You're redirected to the **Voter Dashboard**

### What you can do as Voter:
- See **Active Elections** — the Demo Election 2024 you created
- Click **"Cast Vote"** on an active election
- Select a candidate (Alice / Bob / Carol)
- Click **"Continue to Confirm"**
- Review your selection → click **"Sign & Submit Vote"**
- MetaMask popup → click **"Confirm"** (pays a tiny gas fee from the 10,000 test ETH)
- You'll see a success screen with your **Transaction Hash** and **Vote Hash**
- Click **"View on Etherscan"** (won't work on local, only on Sepolia testnet)

---

## Step 11 — View Election Results

1. Go to the **Voter Dashboard** (`/dashboard`)
2. Scroll to **Completed Elections** (or click Results from an active election)
3. Go to `/results/2` (the demo election is id 2)
4. You'll see:
   - Live vote counts from the blockchain
   - Percentage bars
   - The current winner highlighted in gold

---

## Account Reference

| Account | Role | Address | Private Key |
|---------|------|---------|-------------|
| BlockVote Admin | Contract owner, can create elections & register voters | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| BlockVote Voter | Pre-registered voter, can cast votes | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` |

> These are Hardhat test accounts with 10,000 test ETH each. Never use these keys on mainnet or any real network.

---

## Troubleshooting

**MetaMask says "wrong network"**
→ Switch to **Hardhat Local** in MetaMask network dropdown

**"Could not fetch chain ID" or connection error**
→ Make sure Terminal 1 (`npx hardhat node`) is still running

**"Not registered as voter"**
→ You need to register the wallet via the Admin panel first (Step 9 → Voters)

**Terminal 1 shows `EADDRINUSE`**
→ Run `npx kill-port 8545` then try `npx hardhat node` again

**MetaMask shows 0 ETH**
→ Make sure you're on the **Hardhat Local** network, not Ethereum Mainnet

**Transactions fail / nonce errors in MetaMask**
→ MetaMask → Settings → Advanced → **"Reset account"** — this clears the nonce cache
