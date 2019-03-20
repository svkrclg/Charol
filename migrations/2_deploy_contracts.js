var CHRToken = artifacts.require("./CHRToken.sol");
var CHRTokenSale = artifacts.require("./CHRTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(CHRToken, 1000000).then(function() {
    // Token price is 0.001 Ether
    var tokenPrice = 1000000000000000;
    return deployer.deploy(CHRTokenSale, CHRToken.address, tokenPrice);
  });
};
