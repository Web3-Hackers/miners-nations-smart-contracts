const MINE = artifacts.require("MINE");

module.exports = function (deployer) {
  // 20000 -> 20% Maximum Ownership of Total Supply
  deployer.deploy(MINE, 20000);
};
