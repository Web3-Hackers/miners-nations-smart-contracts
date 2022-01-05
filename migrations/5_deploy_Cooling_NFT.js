const CoolingNFT = artifacts.require("CoolingNFT");

module.exports = function (deployer) {
  deployer.deploy(CoolingNFT, "");
};
