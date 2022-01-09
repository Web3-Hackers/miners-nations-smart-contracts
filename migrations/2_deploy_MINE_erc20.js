const MINE = artifacts.require("MINE");

module.exports = function (deployer) {
  // 20000 -> 20% Maximum Ownership of Total Supply
  deployer.deploy(MINE, "0xb46bb2E9d9B55D5EAE10960EbBA27F966D9511d1", 20000); // NOTE: Should be replaced with Multisig Wallet address
};
