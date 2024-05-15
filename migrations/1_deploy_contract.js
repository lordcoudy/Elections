const Elections = artifacts.require("Voting");

module.exports = function(deployer) {
    deployer.deploy(Elections);
};
