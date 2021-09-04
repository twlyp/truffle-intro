const VolcanoToken = artifacts.require("VolcanoToken");

const truffleAssert = require("truffle-assert");

const testAddress = "0xcB7C09fEF1a308143D9bf328F2C33f33FaA46bC2";

contract("VolcanoToken", (accounts) => {
  let instance, addrs;

  beforeEach(async () => {
    instance = await VolcanoToken.deployed();
    addrs = await web3.eth.getAccounts();
  });

  describe("mint()", () => {
    let mintedID;

    beforeEach(async () => {
      mintedID = await instance.mint.sendTransaction({ from: addrs[1] });
    });

    it("should transfer the token to the minter", async () => {
      truffleAssert.eventEmitted(
        mintedID,
        "Transfer",
        (ev) => ev.to === addrs[1]
      );
    });

    it("should record the minted token", async () => {
      await truffleAssert.passes(instance.tokens.call(addrs[1], 0));
    });
  });
  // it(`address ${testAddress} should have 0 balance`, async () => {
  //   const balance = await instance.balances.call(testAddress);
  //   assert.equal(balance, 0, `${testAddress} has ${balance} tokens`);
  // });

  // it("the owner should have all the tokens", async () => {
  //   const [owner] = await web3.eth.getAccounts();
  //   const balance = await instance.balances.call(owner);
  //   assert.equal(balance, 10000, "owner doesn't have 10000 tokens");
  // });
});
