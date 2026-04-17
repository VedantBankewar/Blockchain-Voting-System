import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const artifact = JSON.parse(readFileSync(path.join(__dirname, '../artifacts/contracts/VotingContract.sol/VotingContract.json'), 'utf8'));

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
// Hardhat account 0 private key (deterministic for every local node)
const signer = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);

console.log('Deployer:', signer.address);

const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
const contract = await factory.deploy();
await contract.waitForDeployment();
const addr = await contract.getAddress();
console.log('VotingContract deployed to:', addr);

const owner = await contract.owner();
console.log('Owner:', owner);

// Create demo election (starts in 60s, ends in 1 week)
const now = Math.floor(Date.now() / 1000);
const oneWeek = 7 * 24 * 60 * 60;

const tx1 = await contract.createElection(
  "Demo Election 2024",
  "A demonstration election for testing the BlockVote platform",
  now + 60,
  now + oneWeek
);
await tx1.wait();
console.log('Election created: Demo Election 2024');

await (await contract.addCandidate(1, "Alice Johnson", "Progressive Party")).wait();
await (await contract.addCandidate(1, "Bob Smith", "Unity Party")).wait();
await (await contract.addCandidate(1, "Carol Williams", "Innovation Alliance")).wait();
console.log('Candidates added: Alice Johnson, Bob Smith, Carol Williams');

await (await contract.registerVoter(signer.address)).wait();
console.log('Deployer registered as voter:', signer.address);

// Test reading back data
const electionCount = await contract.electionCount();
console.log('\nElection count on-chain:', electionCount.toString());

const election = await contract.getElection(1);
console.log('Election name:', election[1]);
console.log('Election start:', new Date(Number(election[3]) * 1000).toLocaleString());
console.log('Election end:', new Date(Number(election[4]) * 1000).toLocaleString());

const candidates = await contract.getAllCandidates(1);
console.log('Candidates:', candidates.map(c => `${c.name} (${c.party})`).join(', '));

const isVoter = await contract.isRegisteredVoter(signer.address);
console.log('Deployer is registered voter:', isVoter);

console.log('\n========================================');
console.log('Update src/lib/ethereum.ts:');
console.log(`VOTING_CONTRACT_ADDRESS = '${addr}'`);
console.log('========================================\n');
