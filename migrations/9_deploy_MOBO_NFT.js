const MOBONFT = artifacts.require("MOBONFT");

module.exports = function (deployer) {
  deployer.deploy(MOBONFT, "");
};
