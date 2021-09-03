const Volcano = artifacts.require("VolcanoCoin");

const testAddress = "0xcB7C09fEF1a308143D9bf328F2C33f33FaA46bC2";

contract("Volcano", (accounts) => {
  let instance;

  beforeEach(async () => {
    instance = await Volcano.deployed();
  });

  it("should mint 10000 VolcanoCoin", async () => {
    const totalSupply = await instance.totalSupply.call();
    assert.equal(totalSupply.toNumber(), 10000, "Minting Failed");
  });

  it(`address ${testAddress} should have 0 balance`, async () => {
    const balance = await instance.balances.call(testAddress);
    assert.equal(balance, 0, `${testAddress} has ${balance} tokens`);
  });

  it("the owner should have all the tokens", async () => {
    const [owner] = await web3.eth.getAccounts();
    const balance = await instance.balances.call(owner);
    assert.equal(balance, 10000, "owner doesn't have 10000 tokens");
  });
});
