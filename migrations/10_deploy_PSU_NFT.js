const PSUNFT = artifacts.require("PSUNFT");

module.exports = function (deployer) {
  deployer.deploy(PSUNFT, "");
};
