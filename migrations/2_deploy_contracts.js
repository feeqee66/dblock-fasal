const FarmingAgreement = artifacts.require("FarmingAgreement");

module.exports = function (deployer) {
  deployer.deploy(FarmingAgreement);
};
