import { ethers } from "hardhat";
import { RejuvenateFinance } from "../typechain";

const v1 = "0x2B60Bd0D80495DD27CE3F8610B4980E94056b30c";

async function main() {
  // MAIN REJUVENATE CONTRACT
  const RJVF = await ethers.getContractFactory("RejuvenateFinance");
  const rjvf = await RJVF.deploy();
  await rjvf.deployed();
  console.log("RJVF Token deployed to:", rjvf.address);
  // STAKING CONTRACT
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(
    rjvf.address,
    BigInt("10000000000000000") // ~300 RJVF per Day
  );
  await staking.deployed();
  console.log("Staking deployed to:", staking.address);
  // MIGRATION
  const Migration = await ethers.getContractFactory("MigrationV1V2");
  const migration = await Migration.deploy(v1, rjvf.address);
  await migration.deployed();
  console.log("Migration deployed to:", migration.address);
  const minterRole = await rjvf.MINTER_ROLE();
  await rjvf.grantRole(minterRole, staking.address);
  console.log("Minting granted to Staking");
  await rjvf.grantRole(minterRole, migration.address);
  console.log("Minting granted to Migration");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
