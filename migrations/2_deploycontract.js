const   Charging = artifacts.require("Charging");

module.exports = function(deployer) {
  deployer.deploy(Charging);
};