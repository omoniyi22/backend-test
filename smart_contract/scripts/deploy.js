const hre = require("hardhat");


const main = async () => {
    const Transaction = await hre.ethers.getContractFactory("Transactions");
    const transactions = await Transaction.deploy();

    transactions.deploymentTransaction();

    console.log("Transactions deployed to: ", await transactions.getAddress());
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

runMain();