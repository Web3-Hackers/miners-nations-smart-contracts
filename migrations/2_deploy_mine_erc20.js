const ERC20Custom = artifacts.require("ERC20Custom");

module.exports = function (deployer) {
  deployer.deploy(ERC20Custom, "MINE Token", "MINE");
};
