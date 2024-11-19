const hre = require("hardhat");

// const tokens = (n) => {
//   return ethers.utils.parseUnits(n.toString(), "ether");
// }

async function main() {
  const [buyer, seller, inspector, lender] = await hre.ethers.getSigners();

  const RealEstate = await hre.ethers.getContractFactory("RealEstate");
  const realEstate = await RealEstate.deploy();
  await realEstate.deployed();

  console.log(`Deployed Real Estate Contract at: ${realEstate.address}`);
  console.log(`Minting 3 properties...\n`);

  for (let i = 0; i < 3; i++) {
    const transaction = await realEstate.connect(seller).mint(`https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/${i + 1}.json`);
    await transaction.wait();
  }

  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(
    realEstate.address,
    seller.address,
    inspector.address,
    lender.address
  );
  await escrow.deployed();

  console.log(`Deployed Escrow Contract at: ${escrow.address}`);

  for (let i = 0; i < 3; i++) {
    let transaction = await realEstate.connect(seller).approve(escrow.address, i + 1);
    await transaction.wait();

    transaction = await escrow.connect(seller).list(i + 1, buyer.address, hre.ethers.utils.parseUnits("20", "ether"), hre.ethers.utils.parseUnits("10", "ether"));
    await transaction.wait();
  }

  console.log("Finished.");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
