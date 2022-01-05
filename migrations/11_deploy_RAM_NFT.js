const RAMNFT = artifacts.require("RAMNFT");

module.exports = function (deployer) {
  deployer.deploy(RAMNFT, "");
};
