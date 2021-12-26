const GPUNFT = artifacts.require("GPUNFT");

module.exports = function (deployer) {
  deployer.deploy(GPUNFT, "");
};
