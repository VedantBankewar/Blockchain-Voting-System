// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BlockVote - Decentralized Voting Smart Contract
 * @notice A secure and transparent voting system on the Ethereum blockchain
 * @dev Implements election management, candidate registration, and vote casting
 */
contract VotingContract {
    // ============ Structs ============
    
    struct Election {
        uint256 id;
        string name;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        address admin;
        uint256 totalVotes;
        uint256 candidateCount;
    }
    
    struct Candidate {
        uint256 id;
        uint256 electionId;
        string name;
        string party;
        uint256 voteCount;
        bool isActive;
    }
    
    struct Vote {
        address voter;
        uint256 electionId;
        uint256 candidateId;
        uint256 timestamp;
        bytes32 voteHash;
    }
    
    // ============ State Variables ============
    
    address public owner;
    uint256 public electionCount;
    uint256 public totalVotesCast;
    
    mapping(uint256 => Election) public elections;
    mapping(uint256 => mapping(uint256 => Candidate)) public candidates;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => Vote)) public voterReceipts;
    mapping(address => bool) public registeredVoters;
    mapping(address => bool) public admins;
    
    // ============ Events ============
    
    event ElectionCreated(
        uint256 indexed electionId,
        string name,
        uint256 startTime,
        uint256 endTime,
        address indexed admin
    );
    
    event CandidateAdded(
        uint256 indexed electionId,
        uint256 indexed candidateId,
        string name,
        string party
    );
    
    event VoteCast(
        uint256 indexed electionId,
        uint256 indexed candidateId,
        address indexed voter,
        bytes32 voteHash,
        uint256 timestamp
    );
    
    event VoterRegistered(address indexed voter);
    event ElectionEnded(uint256 indexed electionId);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner, "Only admin can call this function");
        _;
    }
    
    modifier onlyRegisteredVoter() {
        require(registeredVoters[msg.sender], "Voter is not registered");
        _;
    }
    
    modifier electionExists(uint256 _electionId) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        _;
    }
    
    modifier electionActive(uint256 _electionId) {
        Election storage election = elections[_electionId];
        require(election.isActive, "Election is not active");
        require(block.timestamp >= election.startTime, "Election has not started");
        require(block.timestamp <= election.endTime, "Election has ended");
        _;
    }
    
    // ============ Constructor ============
    
    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Add a new admin
     * @param _admin Address of the new admin
     */
    function addAdmin(address _admin) external onlyOwner {
        require(_admin != address(0), "Invalid address");
        require(!admins[_admin], "Already an admin");
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }
    
    /**
     * @notice Remove an admin
     * @param _admin Address of the admin to remove
     */
    function removeAdmin(address _admin) external onlyOwner {
        require(_admin != owner, "Cannot remove owner");
        require(admins[_admin], "Not an admin");
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }
    
    /**
     * @notice Register a voter
     * @param _voter Address of the voter to register
     */
    function registerVoter(address _voter) external onlyAdmin {
        require(_voter != address(0), "Invalid address");
        require(!registeredVoters[_voter], "Voter already registered");
        registeredVoters[_voter] = true;
        emit VoterRegistered(_voter);
    }
    
    /**
     * @notice Create a new election
     * @param _name Name of the election
     * @param _description Description of the election
     * @param _startTime Start time (unix timestamp)
     * @param _endTime End time (unix timestamp)
     */
    function createElection(
        string memory _name,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime
    ) external onlyAdmin returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_startTime < _endTime, "Invalid time range");
        require(_startTime >= block.timestamp, "Start time must be in the future");
        
        electionCount++;
        
        elections[electionCount] = Election({
            id: electionCount,
            name: _name,
            description: _description,
            startTime: _startTime,
            endTime: _endTime,
            isActive: true,
            admin: msg.sender,
            totalVotes: 0,
            candidateCount: 0
        });
        
        emit ElectionCreated(electionCount, _name, _startTime, _endTime, msg.sender);
        
        return electionCount;
    }
    
    /**
     * @notice Add a candidate to an election
     * @param _electionId ID of the election
     * @param _name Name of the candidate
     * @param _party Party of the candidate
     */
    function addCandidate(
        uint256 _electionId,
        string memory _name,
        string memory _party
    ) external onlyAdmin electionExists(_electionId) returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        Election storage election = elections[_electionId];
        require(block.timestamp < election.startTime, "Cannot add candidates after election starts");
        
        election.candidateCount++;
        uint256 candidateId = election.candidateCount;
        
        candidates[_electionId][candidateId] = Candidate({
            id: candidateId,
            electionId: _electionId,
            name: _name,
            party: _party,
            voteCount: 0,
            isActive: true
        });
        
        emit CandidateAdded(_electionId, candidateId, _name, _party);
        
        return candidateId;
    }
    
    // ============ Voting Functions ============
    
    /**
     * @notice Cast a vote in an election
     * @param _electionId ID of the election
     * @param _candidateId ID of the candidate
     */
    function castVote(
        uint256 _electionId,
        uint256 _candidateId
    ) external onlyRegisteredVoter electionExists(_electionId) electionActive(_electionId) {
        require(!hasVoted[_electionId][msg.sender], "Already voted in this election");
        
        Election storage election = elections[_electionId];
        require(_candidateId > 0 && _candidateId <= election.candidateCount, "Invalid candidate");
        
        Candidate storage candidate = candidates[_electionId][_candidateId];
        require(candidate.isActive, "Candidate is not active");
        
        // Generate vote hash for verification
        bytes32 voteHash = keccak256(
            abi.encodePacked(
                msg.sender,
                _electionId,
                _candidateId,
                block.timestamp,
                blockhash(block.number - 1)
            )
        );
        
        // Record the vote
        hasVoted[_electionId][msg.sender] = true;
        candidate.voteCount++;
        election.totalVotes++;
        totalVotesCast++;
        
        // Store vote receipt
        voterReceipts[_electionId][msg.sender] = Vote({
            voter: msg.sender,
            electionId: _electionId,
            candidateId: _candidateId,
            timestamp: block.timestamp,
            voteHash: voteHash
        });
        
        emit VoteCast(_electionId, _candidateId, msg.sender, voteHash, block.timestamp);
    }
    
    /**
     * @notice End an election early
     * @param _electionId ID of the election to end
     */
    function endElection(uint256 _electionId) external onlyAdmin electionExists(_electionId) {
        Election storage election = elections[_electionId];
        require(election.isActive, "Election already ended");
        election.isActive = false;
        emit ElectionEnded(_electionId);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get election details
     * @param _electionId ID of the election
     */
    function getElection(uint256 _electionId) external view electionExists(_electionId) 
        returns (
            uint256 id,
            string memory name,
            string memory description,
            uint256 startTime,
            uint256 endTime,
            bool isActive,
            uint256 totalVotes,
            uint256 candidateCount
        ) 
    {
        Election storage election = elections[_electionId];
        return (
            election.id,
            election.name,
            election.description,
            election.startTime,
            election.endTime,
            election.isActive,
            election.totalVotes,
            election.candidateCount
        );
    }
    
    /**
     * @notice Get candidate details
     * @param _electionId ID of the election
     * @param _candidateId ID of the candidate
     */
    function getCandidate(uint256 _electionId, uint256 _candidateId) external view 
        returns (
            uint256 id,
            string memory name,
            string memory party,
            uint256 voteCount,
            bool isActive
        ) 
    {
        Candidate storage candidate = candidates[_electionId][_candidateId];
        return (
            candidate.id,
            candidate.name,
            candidate.party,
            candidate.voteCount,
            candidate.isActive
        );
    }
    
    /**
     * @notice Get all candidates for an election
     * @param _electionId ID of the election
     */
    function getAllCandidates(uint256 _electionId) external view electionExists(_electionId)
        returns (Candidate[] memory)
    {
        Election storage election = elections[_electionId];
        Candidate[] memory allCandidates = new Candidate[](election.candidateCount);
        
        for (uint256 i = 1; i <= election.candidateCount; i++) {
            allCandidates[i - 1] = candidates[_electionId][i];
        }
        
        return allCandidates;
    }
    
    /**
     * @notice Check if an address has voted in an election
     * @param _electionId ID of the election
     * @param _voter Address of the voter
     */
    function checkVoted(uint256 _electionId, address _voter) external view returns (bool) {
        return hasVoted[_electionId][_voter];
    }
    
    /**
     * @notice Get vote receipt for a voter
     * @param _electionId ID of the election
     * @param _voter Address of the voter
     */
    function getVoteReceipt(uint256 _electionId, address _voter) external view 
        returns (
            uint256 electionId,
            uint256 candidateId,
            uint256 timestamp,
            bytes32 voteHash
        )
    {
        require(hasVoted[_electionId][_voter], "Voter has not voted");
        Vote storage vote = voterReceipts[_electionId][_voter];
        return (
            vote.electionId,
            vote.candidateId,
            vote.timestamp,
            vote.voteHash
        );
    }
    
    /**
     * @notice Verify a vote using its hash
     * @param _electionId ID of the election
     * @param _voteHash Hash of the vote to verify
     */
    function verifyVote(uint256 _electionId, bytes32 _voteHash) external view returns (bool) {
        Vote storage vote = voterReceipts[_electionId][msg.sender];
        return vote.voteHash == _voteHash;
    }
    
    /**
     * @notice Check if an address is a registered voter
     * @param _voter Address to check
     */
    function isRegisteredVoter(address _voter) external view returns (bool) {
        return registeredVoters[_voter];
    }
    
    /**
     * @notice Check if an address is an admin
     * @param _admin Address to check
     */
    function isAdmin(address _admin) external view returns (bool) {
        return admins[_admin] || _admin == owner;
    }
    
    /**
     * @notice Get the current election status
     * @param _electionId ID of the election
     */
    function getElectionStatus(uint256 _electionId) external view electionExists(_electionId)
        returns (string memory)
    {
        Election storage election = elections[_electionId];
        
        if (!election.isActive) {
            return "ended";
        } else if (block.timestamp < election.startTime) {
            return "upcoming";
        } else if (block.timestamp > election.endTime) {
            return "completed";
        } else {
            return "active";
        }
    }
}
