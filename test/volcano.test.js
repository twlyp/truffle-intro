const Volcano = artifacts.require("VolcanoCoin");
contract("Volcano", accounts => {
    it("should mint 10000 VolcanoCoin", async () => {
    const instance = await Volcano.deployed();
    //console.log(instance);
    const totalSupply = await instance.totalSupply.call();
    assert.equal(
        totalSupply.toNumber(),
       9999,
        "Minting Failed",
        );            
    });
});