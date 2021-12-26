const RIGNFT = artifacts.require("RIGNFT");

module.exports = function (deployer) {
  deployer.deploy(RIGNFT, "RIG NFT", "RIG");
};
