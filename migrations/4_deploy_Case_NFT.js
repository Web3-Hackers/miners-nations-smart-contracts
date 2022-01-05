const CaseNFT = artifacts.require("CaseNFT");

module.exports = function (deployer) {
  deployer.deploy(CaseNFT, "");
};
