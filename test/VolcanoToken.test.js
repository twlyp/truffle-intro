const VolcanoToken = artifacts.require("VolcanoToken");

const truffleAssert = require("truffle-assert");

contract("VolcanoToken", (accounts) => {
  let instance;

  beforeEach(async () => {
    instance = await VolcanoToken.deployed();
  });

  contract("mint()", () => {
    let tx;

    beforeEach(async () => {
      tx = await instance.mint.sendTransaction({ from: accounts[1] });
    });

    it("should increment the minter's balance", async () => {
      const balance = await instance.balanceOf(accounts[1]);
      assert.equal(balance, 1, `owner's balance is ${balance}`);
    });

    it("should set the correct owner for the token", async () => {
      const owner = await instance.ownerOf(0);
      assert.equal(owner, accounts[1], `${owner} owns the token`);
    });

    it("should transfer the token to the minter", async () => {
      truffleAssert.eventEmitted(tx, "Transfer", (ev) => ev.to === accounts[1]);
    });

    it("should record the minted token", async () => {
      await truffleAssert.passes(instance.tokens.call(accounts[1], 0));
    });
  });

  contract("burn()", () => {
    let tx;

    beforeEach(async () => {
      tx = await instance.mint.sendTransaction({ from: accounts[1] });
    });

    it("should decrement the owner's balance", async () => {
      const oldBalance = await instance.balanceOf(accounts[1]);
      await instance.burn.sendTransaction(0, { from: accounts[1] });
      const newBalance = await instance.balanceOf(accounts[1]);
      assert.equal(
        newBalance - oldBalance,
        -1,
        `owner's balance didn't decrease`
      );
    });

    it("should make the token unspendable", async () => {
      await instance.burn.sendTransaction(1, { from: accounts[1] });

      await truffleAssert.reverts(
        instance.safeTransferFrom(accounts[1], accounts[2], 1),
        "ERC721: operator query for nonexistent token.",
        "this transfer should revert"
      );
    });

    it("shouldn't let users other than the owner burn the token", async () => {
      await truffleAssert.reverts(
        instance.burn.sendTransaction(2, { from: accounts[2] }),
        "you are not allowed to burn this token",
        "the burning should revert"
      );
    });
  });
});
