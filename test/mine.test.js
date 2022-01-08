const { expect } = require("chai");
const MINE = artifacts.require("MINE");

contract("MINE Token", (accounts) => {
  beforeEach(async () => {
    this.mine = await MINE.new(20000, { from: accounts[0] });
  });

  it("Should mine initial supply successfully", async () => {
    const initialMintAmount = 100000000000000;
    expect(parseInt(await this.mine.balanceOf(accounts[0]))).to.equal(0);

    await this.mine.mint(accounts[0], initialMintAmount, {
      from: accounts[0],
    });

    expect(parseInt(await this.mine.balanceOf(accounts[0]))).to.equal(
      initialMintAmount
    );
  });

  it("Should have initial maximum ownership percentage of 20%", async () => {
    expect(parseInt(await this.mine.maxOwnership())).to.equal(20000);
  });

  it("Should enable set maximum ownership percentage for owners", async () => {
    expect(parseInt(await this.mine.maxOwnership())).to.equal(20000);

    await this.mine.setMaxOwnership(30000, { from: accounts[0] });

    expect(parseInt(await this.mine.maxOwnership())).to.equal(30000);
  });

  it("Should disable set maximum ownership percentage for non-owners", async () => {
    expect(parseInt(await this.mine.maxOwnership())).to.equal(20000);

    // expect(
    //   await this.mine.setMaxOwnership(30000, { from: accounts[1] })
    // ).to.throw();
  });

  it("Should enable transfer to address with less than or equal to the maximum ownership", async () => {
    const initialMintAmount = 100000000000000;

    await this.mine.mint(accounts[0], initialMintAmount, {
      from: accounts[0],
    });

    await this.mine.transfer(accounts[1], initialMintAmount * 0.2, {
      from: accounts[0],
    });

    expect(parseInt(await this.mine.balanceOf(accounts[1]))).to.equal(
      initialMintAmount * 0.2
    );
  });

  it("Should disable transfer to address with larger than the maximum ownership", () => {});

  it("Should enable mint to address with less than or equal to the maximum ownership", async () => {
    const initialMintAmount = 100000000000000;

    await this.mine.mint(accounts[0], initialMintAmount, {
      from: accounts[0],
    });

    // Adding 25% of initial supply will result in 20% post ownership
    await this.mine.mint(accounts[1], initialMintAmount * 0.25, {
      from: accounts[0],
    });

    expect(parseInt(await this.mine.balanceOf(accounts[1]))).to.equal(
      initialMintAmount * 0.25
    );
  });

  it("Should enable mint to address with less than or equal to the maximum ownership", () => {});
});
