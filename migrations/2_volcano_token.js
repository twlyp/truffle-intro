const VolcanoToken = artifacts.require("VolcanoToken");

module.exports = async function (deployer) {
  await deployer.deploy(VolcanoToken);
};
