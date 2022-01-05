const DriveNFT = artifacts.require("DriveNFT");

module.exports = function (deployer) {
  deployer.deploy(DriveNFT, "");
};
