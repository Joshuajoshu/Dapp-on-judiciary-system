const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const Judiciary_Dapp = await hre.ethers.getContractFactory("CourtRecords");

    // Deploy the contract (Ethers v5 uses .deployed() instead of .wait())
    const admin = "0x2dba4F6548111Af11493Ca4D3bD604Dc8958CB37";
    const wasteManagement = await Judiciary_Dapp.deploy();
    await wasteManagement.deployed(); // This works in Ethers v5

    console.log("WasteManagement contract deployed to:", wasteManagement.address); //0x1049f2aEd8c09964B75e4d4987E2B762D8673c2D
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });