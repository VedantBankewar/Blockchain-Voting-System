// Contract deployment address (will be updated after deployment)
export const VOTING_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

// ABI for the VotingContract
export const VOTING_CONTRACT_ABI = [
    // Events
    'event ElectionCreated(uint256 indexed electionId, string name, uint256 startTime, uint256 endTime, address indexed admin)',
    'event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name, string party)',
    'event VoteCast(uint256 indexed electionId, uint256 indexed candidateId, address indexed voter, bytes32 voteHash, uint256 timestamp)',
    'event VoterRegistered(address indexed voter)',
    'event ElectionEnded(uint256 indexed electionId)',
    'event AdminAdded(address indexed admin)',
    'event AdminRemoved(address indexed admin)',

    // Admin Functions
    'function addAdmin(address _admin) external',
    'function removeAdmin(address _admin) external',
    'function registerVoter(address _voter) external',
    'function createElection(string memory _name, string memory _description, uint256 _startTime, uint256 _endTime) external returns (uint256)',
    'function addCandidate(uint256 _electionId, string memory _name, string memory _party) external returns (uint256)',
    'function endElection(uint256 _electionId) external',

    // Voting Functions
    'function castVote(uint256 _electionId, uint256 _candidateId) external',

    // View Functions
    'function owner() external view returns (address)',
    'function electionCount() external view returns (uint256)',
    'function totalVotesCast() external view returns (uint256)',
    'function getElection(uint256 _electionId) external view returns (uint256 id, string memory name, string memory description, uint256 startTime, uint256 endTime, bool isActive, uint256 totalVotes, uint256 candidateCount)',
    'function getCandidate(uint256 _electionId, uint256 _candidateId) external view returns (uint256 id, string memory name, string memory party, uint256 voteCount, bool isActive)',
    'function getAllCandidates(uint256 _electionId) external view returns (tuple(uint256 id, uint256 electionId, string name, string party, uint256 voteCount, bool isActive)[])',
    'function checkVoted(uint256 _electionId, address _voter) external view returns (bool)',
    'function getVoteReceipt(uint256 _electionId, address _voter) external view returns (uint256 electionId, uint256 candidateId, uint256 timestamp, bytes32 voteHash)',
    'function verifyVote(uint256 _electionId, bytes32 _voteHash) external view returns (bool)',
    'function isRegisteredVoter(address _voter) external view returns (bool)',
    'function isAdmin(address _admin) external view returns (bool)',
    'function getElectionStatus(uint256 _electionId) external view returns (string memory)',
]

// Chain configurations
export const SUPPORTED_CHAINS = {
    hardhat: {
        chainId: 31337,
        name: 'Hardhat Local',
        rpcUrl: 'http://127.0.0.1:8545',
        blockExplorer: '',
    },
    sepolia: {
        chainId: 11155111,
        name: 'Sepolia Testnet',
        rpcUrl: 'https://sepolia.infura.io/v3/',
        blockExplorer: 'https://sepolia.etherscan.io',
    },
}

export function getBlockExplorerUrl(chainId: number, txHash: string): string {
    if (chainId === 11155111) {
        return `https://sepolia.etherscan.io/tx/${txHash}`
    }
    return ''
}

export function getAddressExplorerUrl(chainId: number, address: string): string {
    if (chainId === 11155111) {
        return `https://sepolia.etherscan.io/address/${address}`
    }
    return ''
}
