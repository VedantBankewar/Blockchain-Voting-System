const hre = require("hardhat");

async function main() {
    console.log("Deploying VotingContract...");

    const VotingContract = await hre.ethers.getContractFactory("VotingContract");
    const votingContract = await VotingContract.deploy();

    await votingContract.waitForDeployment();

    const address = await votingContract.getAddress();
    console.log(`VotingContract deployed to: ${address}`);

    // Get deployer address
    const [deployer] = await hre.ethers.getSigners();
    console.log(`Deployed by: ${deployer.address}`);

    // Verify the owner is set correctly
    const owner = await votingContract.owner();
    console.log(`Contract owner: ${owner}`);

    console.log("\n===========================================");
    console.log("IMPORTANT: Update the contract address in:");
    console.log("src/lib/ethereum.ts");
    console.log(`VOTING_CONTRACT_ADDRESS = '${address}'`);
    console.log("===========================================\n");

    // Create a demo election if on local network
    if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
        console.log("Creating demo election...");

        const now = Math.floor(Date.now() / 1000);
        const oneWeek = 7 * 24 * 60 * 60;

        const tx = await votingContract.createElection(
            "Demo Election 2024",
            "A demonstration election for testing the BlockVote platform",
            now + 60, // Starts in 1 minute
            now + oneWeek // Ends in 1 week
        );
        await tx.wait();

        console.log("Demo election created!");

        // Add candidates
        await votingContract.addCandidate(1, "Alice Johnson", "Progressive Party");
        await votingContract.addCandidate(1, "Bob Smith", "Unity Party");
        await votingContract.addCandidate(1, "Carol Williams", "Innovation Alliance");

        console.log("Demo candidates added!");

        // Register the deployer as a voter
        await votingContract.registerVoter(deployer.address);
        console.log(`Deployer registered as voter: ${deployer.address}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
