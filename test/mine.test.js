const { expect } = require("chai");
const { expectRevert } = require("@openzeppelin/test-helpers");
const MINE = artifacts.require("MINE");

contract("MINE Token", (accounts) => {
  beforeEach(async () => {
    this.mine = await MINE.new(accounts[0], 20000, { from: accounts[0] });
  });

  /**
   * Testing basic features after token initialization:
   * - Should mine the initial supply correctly
   * - Should have the default maximum ownership percentage of 20%
   */
  describe("Token Initialization", () => {
    it("Should mine initial supply successfully (20 billion)", async () => {
      expect(parseInt(await this.mine.balanceOf(accounts[0]))).to.equal(2e28);
    });

    it("Should have initial maximum ownership percentage of 20%", async () => {
      expect(parseInt(await this.mine.maxOwnership())).to.equal(20000);
    });
  });

  describe("Token Cap Supply", () => {
    it("Should enable set new cap supply by the owner", async () => {});

    it("Should disable set new cap supply by non-owners", async () => {});

    it("Should enable set new cap supply by the owner", async () => {});

    it("Should enable set new cap supply by the owner", async () => {});
  });

  /**
   * Testing Token Maximum Ownership Access Control Feature
   * - Should only allow contract owner to set new maximum ownership percentage
   * - Should unallow non-contract owner to set new maximum ownership percentage
   */
  describe("Token Maximum Ownership Access Control", () => {
    it("Should enable set maximum ownership percentage for owners", async () => {
      expect(parseInt(await this.mine.maxOwnership())).to.equal(20000);

      await this.mine.setMaxOwnership(30000, { from: accounts[0] });

      expect(parseInt(await this.mine.maxOwnership())).to.equal(30000);
    });

    it("Should disable set maximum ownership percentage for non-owners", async () => {
      expect(parseInt(await this.mine.maxOwnership())).to.equal(20000);

      expectRevert(
        // Set Maximum Ownership Percentage to 30%
        this.mine.setMaxOwnership(30000, { from: accounts[1] }),
        "Ownable: caller is not the owner"
      );
    });
  });

  /**
   * Testing Token Transfer with Maximum Ownership Feature
   * - Should only allow token transfer it it is less than or equal to the maximum ownership percentage
   * - Should unallow token transfer if it is larger than maximum ownership percentage
   */
  describe("Token Transfer with Maximum Ownership Restriction", () => {
    it("Should enable transfer to address with less than or equal to the maximum ownership", async () => {
      // 20% of 20 billion, hardcoded at the moment
      const transferAmount = "4000000000000000000000000000";
      await this.mine.transfer(accounts[1], web3.utils.toBN(transferAmount), {
        from: accounts[0],
      });

      expect(parseInt(await this.mine.balanceOf(accounts[1]))).to.equal(4e27);
    });

    it("Should disable transfer to address with larger than the maximum ownership", async () => {
      // 21% of 20 billion, hardcoded at the moment
      const transferAmount = "4200000000000000000000000000";

      expectRevert(
        // Send 21% of the total existing supply (SHOULD FAIL)
        this.mine.transfer(accounts[1], web3.utils.toBN(transferAmount), {
          from: accounts[0],
        }),
        "MINE: End balance exceeding the maximum ownership percentage of total supply is prohibited!"
      );
    });
  });

  /**
   * Testing Token Minting with Maximum Ownership Feature
   * - Should only allow minting to address with less than or equal to the maximum ownership percentage
   * - Shoudl unallow minting to address with greater than the maximum ownership percentage (Whale-Resistance Ownership)
   */
  describe("Token Minting with Maximum Ownership Restriction", () => {
    it("Should enable mint to address with less than or equal to the maximum ownership", async () => {
      const mintAmount = "5000000000000000000000000000";
      await this.mine.increaseCap(mintAmount, { from: accounts[0] });

      // Adding 25% of initial supply will result in 20% post ownership
      await this.mine.mint(accounts[1], web3.utils.toBN(mintAmount), {
        from: accounts[0],
      });

      expect(parseInt(await this.mine.balanceOf(accounts[1]))).to.equal(5e27);
    });

    it("Should disable mint to address with greater than the maximum ownership", async () => {
      const mintAmount = "5200000000000000000000000000";
      await this.mine.increaseCap(mintAmount, { from: accounts[0] });

      expectRevert(
        // Adding 26% of initial supply will result to >20% post ownership (SHOULD FAIL)
        this.mine.mint(accounts[1], web3.utils.toBN(mintAmount), {
          from: accounts[0],
        }),
        "MINE: End balance exceeding the maximum ownership percentage of total supply is prohibited!"
      );
    });
  });
});
