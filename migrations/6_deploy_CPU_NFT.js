const CPUNFT = artifacts.require("CPUNFT");

module.exports = function (deployer) {
  deployer.deploy(CPUNFT, "");
};
