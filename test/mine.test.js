const { expect } = require("chai");
const truffleAssert = require("truffle-assertions");
const MINE = artifacts.require("MINE");

contract("MINE Token", (accounts) => {
  beforeEach(async () => {
    this.mine = await MINE.new(accounts[0], 20000, { from: accounts[0] });
  });

  /**
   * Testing basic features after token initialization:
   * - Should have the correct name, symbol, and decimals
   * - Should mine the initial supply correctly
   * - Should have the default maximum ownership percentage of 20%
   */
  describe("Token Initialization", () => {
    it("Should have the correct name, symbol, and decimals", async () => {
      expect(await this.mine.name()).to.equal("MINE Token");
      expect(await this.mine.symbol()).to.equal("MINE");
      expect(parseInt(await this.mine.decimals())).to.equal(18);
    });

    it("Should minted initial supply successfully (20 billion)", async () => {
      expect(parseInt(await this.mine.balanceOf(accounts[0]))).to.equal(2e28);
    });

    it("Should have initial maximum ownership percentage of 20%", async () => {
      expect(parseInt(await this.mine.maxOwnership())).to.equal(20000);
    });
  });

  /**
   * Testing token cap supply:
   * - Should enable set new cap supply by the owner
   * - Should disable set new cap supply by non-owners
   * - Should disable set new cap supply with 0 value
   * - Should enable increase cap supply by the owner
   * - Should disable increase cap supply by non-owners
   * - Should disable increase cap supply with 0 value
   * - Should enable decrease cap supply by the owner
   * - Should disable decrease cap supply by non-owners
   * - Should disable decrease cap supply with 0 value
   * - Should disable decrease cap supply more than the difference between cap supply and minted supply
   */
  describe("Token Cap Supply", () => {
    it("Should enable set new cap supply by the owner", async () => {
      // Set new cap supply to 200 billion
      await this.mine.setCap(
        web3.utils.toBN("200000000000000000000000000000"),
        { from: accounts[0] }
      );

      expect(parseInt(await this.mine.cap())).to.equal(2e29);
    });

    it("Should disable set new cap supply by non-owners", async () => {
      await truffleAssert.reverts(
        // Set new supply to 200 billion
        this.mine.setCap(web3.utils.toBN("200000000000000000000000000000"), {
          from: accounts[1],
        }),
        "Ownable: caller is not the owner"
      );
    });

    it("Should disable set new cap supply with 0 value", async () => {
      truffleAssert.reverts(
        // Set new supply to 200 billion
        this.mine.setCap(0, {
          from: accounts[0],
        }),
        "ERC20Custom: New cap set to be lower than or equal to total supply!"
      );
    });

    it("Should enable increase cap supply by the owner", async () => {
      // increase the cap supply by 20 billion
      await this.mine.increaseCap(
        web3.utils.toBN("20000000000000000000000000000"),
        {
          from: accounts[0],
        }
      );

      expect(parseInt(await this.mine.cap())).to.equal(4e28);
    });

    it("Should disable increase cap supply by non-owners", async () => {
      // increase the cap supply by 20 billion
      truffleAssert.reverts(
        this.mine.increaseCap(
          web3.utils.toBN("20000000000000000000000000000"),
          {
            from: accounts[1],
          }
        ),
        "Ownable: caller is not the owner"
      );
    });

    it("Should disable increase cap supply with 0 value", async () => {
      truffleAssert.reverts(
        this.mine.increaseCap(0, {
          from: accounts[0],
        }),
        "ERC20Custom: Increase Cap value has non-valid 0 value!"
      );
    });

    it("Should enable decrease cap supply by the owner", async () => {
      // increase the cap supply by 10 billion
      // this is required because 20 billion has been minted and the cap supply is 20 billion
      // if not, revert error will appear
      await this.mine.increaseCap(
        web3.utils.toBN("10000000000000000000000000000"),
        {
          from: accounts[0],
        }
      );

      // decrease the cap supply by 10 billion
      await this.mine.decreaseCap(
        web3.utils.toBN("10000000000000000000000000000"),
        {
          from: accounts[0],
        }
      );

      expect(parseInt(await this.mine.cap())).to.equal(2e28);
    });

    it("Should disable decrease cap supply by non-owners", async () => {
      // increase the cap supply by 10 billion
      // this is required because 20 billion has been minted and the cap supply is 20 billion
      // if not, revert error will appear
      await this.mine.increaseCap(
        web3.utils.toBN("10000000000000000000000000000"),
        {
          from: accounts[0],
        }
      );

      // decrease the cap supply by 10 billion
      truffleAssert.reverts(
        this.mine.decreaseCap(
          web3.utils.toBN("10000000000000000000000000000"),
          {
            from: accounts[1],
          }
        ),
        "Ownable: caller is not the owner."
      );
    });

    it("Should disable decrease cap supply with 0 value", async () => {
      // increase the cap supply by 10 billion
      // this is required because 20 billion has been minted and the cap supply is 20 billion
      // if not, revert error will appear
      await this.mine.increaseCap(
        web3.utils.toBN("10000000000000000000000000000"),
        {
          from: accounts[0],
        }
      );

      truffleAssert.reverts(
        this.mine.decreaseCap(0, {
          from: accounts[0],
        }),
        "ERC20Custom: Decrease Cap value has non-valid value!"
      );
    });

    it("Should disable decrease cap supply more than the difference between cap supply and minted supply", async () => {
      // Since 20 billion has been minted and the cap supply is 20 billion, the difference between them is 0
      // Therefore, it shall revert as the cap supply can't be decreased (without deviating from the total minted supply)
      truffleAssert.reverts(
        this.mine.decreaseCap(
          web3.utils.toBN("10000000000000000000000000000"),
          {
            from: accounts[0],
          }
        ),
        "ERC20Custom: Decrease Cap value has non-valid value!"
      );
    });
  });

  /**
   * Testing Token Maximum Ownership Feature:
   * - Should only allow contract owner to set new maximum ownership percentage
   * - Should unallow non-contract owner to set new maximum ownership percentage
   * - Should enable set maximum ownership percentage feature to be disabled (100% maximum ownership allowed)
   * - Should disable set maximum ownership percentage with 0 value
   * - Should disable set maximum ownership percentage with > 100% value
   * - Should enable increase maximum ownership percentage the owner
   * - Should disable increase maximum ownership percentage non-owners
   * - Should disable increase maximum ownership with 0 value
   * - Should disable increase maximum ownership when the new max ownership total exceeds 100%
   * - Should enable decrease maximum ownership percentage for the owner
   * - Should disable decrease maximum ownership percentage for non-owners
   * - Should disable decrease maximum ownership with 0 value
   * - Should disable decrease maximum ownership with value larger than current maximum ownership percentage
   */
  describe("Token Maximum Ownership", () => {
    it("Should enable set maximum ownership percentage for the owner", async () => {
      expect(parseInt(await this.mine.maxOwnership())).to.equal(20000);

      await this.mine.setMaxOwnership(30000, { from: accounts[0] });

      expect(parseInt(await this.mine.maxOwnership())).to.equal(30000);
    });

    it("Should disable set maximum ownership percentage for non-owners", async () => {
      expect(parseInt(await this.mine.maxOwnership())).to.equal(20000);

      truffleAssert.reverts(
        // Set Maximum Ownership Percentage to 30%
        this.mine.setMaxOwnership(30000, { from: accounts[1] }),
        "Ownable: caller is not the owner"
      );
    });

    it("Should enable set maximum ownership percentage feature to be disabled (100% maximum ownership allowed)", async () => {
      await this.mine.setMaxOwnership(100000, { from: accounts[0] });

      expect(parseInt(await this.mine.maxOwnership())).to.equal(100000);
    });

    it("Should disable set maximum ownership percentage with 0 value", async () => {
      truffleAssert.reverts(
        this.mine.setMaxOwnership(0, { from: accounts[0] }),
        "MINE: New Max Ownership Percentage must be larger than 0 or at most 100% (5 decimals)"
      );
    });

    it("Should disable set maximum ownership percentage with > 100% value", async () => {
      truffleAssert.reverts(
        this.mine.setMaxOwnership(101000, { from: accounts[0] }),
        "MINE: New Max Ownership Percentage must be larger than 0 or at most 100% (5 decimals)"
      );
    });

    it("Should enable increase maximum ownership percentage for the owner", async () => {
      // Increase Maximum Ownership by 20%
      await this.mine.increaseMaxOwnership(20000, { from: accounts[0] });

      expect(parseInt(await this.mine.maxOwnership())).to.equal(40000);
    });

    it("Should disable increase maximum ownership percentage for non-owners", async () => {
      // Increase Maximum Ownership by 20%
      truffleAssert.reverts(
        this.mine.increaseMaxOwnership(20000, { from: accounts[1] }),
        "Ownable: caller is not the owner"
      );
    });

    it("Should disable increase maximum ownership with 0 value", async () => {
      truffleAssert.reverts(
        this.mine.increaseMaxOwnership(0, { from: accounts[0] }),
        "MINE: Increased Max Ownership Percentage must be larger than 0 or the sum with the current Max Ownership must be at most 100% (5 decimals)"
      );
    });

    it("Should disable increase maximum ownership when the new max ownership total exceeds 100%", async () => {
      // By default, the maximum ownership is 20%
      // By increasing it by 81%, it should exceed 100% which will revert
      truffleAssert.reverts(
        this.mine.increaseMaxOwnership(81000, { from: accounts[0] }),
        "MINE: Increased Max Ownership Percentage must be larger than 0 or the sum with the current Max Ownership must be at most 100% (5 decimals)"
      );
    });

    it("Should enable decrease maximum ownership percentage for the owner", async () => {
      // Decrease Maximum Ownership by 1%
      await this.mine.decreaseMaxOwnership(1000, { from: accounts[0] });

      expect(parseInt(await this.mine.maxOwnership())).to.equal(19000);
    });

    it("Should disable decrease maximum ownership percentage for non-owners", async () => {
      // Decrease Maximum Ownership by 1%
      truffleAssert.reverts(
        this.mine.decreaseMaxOwnership(1000, { from: accounts[1] }),
        "Ownable: caller is not the owner"
      );
    });

    it("Should disable decrease maximum ownership with 0 value", async () => {
      truffleAssert.reverts(
        this.mine.decreaseMaxOwnership(0, { from: accounts[0] }),
        "MINE: Decreased Max Ownership Percentage must be larger than 0 or the sum with the current Max Ownership must be at most 100% (5 decimals)"
      );
    });

    it("Should disable decrease maximum ownership with value larger than current maximum ownership percentage", async () => {
      truffleAssert.reverts(
        // Decrease maximum ownership by 21% (> 20%)
        this.mine.decreaseMaxOwnership(21000, { from: accounts[0] }),
        "MINE: Decreased Max Ownership should be less than Current Max Ownership."
      );
    });
  });

  /**
   * Testing Token Transfer with Maximum Ownership Feature:
   * - Should only allow token transfer it it is less than or equal to the maximum ownership percentage
   * - Should enable transfer larger than 20% of totaly supply after increasing maximum ownership
   * - Should unallow token transfer if it is larger than maximum ownership percentage
   * - Should disable transfer for wallet with balance larger than the decreased maximum ownership percentage (setMaxOwnership)
   * - Should disable transfer for wallet with balance larger than the decreased maximum ownership percentage (increaseMaxOwnership)
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

    it("Should enable transfer larger than 20% of totaly supply after increasing maximum ownership", async () => {
      // 25% of 20 billion, hardcoded at the moment
      const transferAmount = "5000000000000000000000000000";

      await this.mine.increaseMaxOwnership(5000, { from: accounts[0] });

      await this.mine.transfer(accounts[1], web3.utils.toBN(transferAmount), {
        from: accounts[0],
      });

      expect(parseInt(await this.mine.balanceOf(accounts[1]))).to.equal(5e27);
    });

    it("Should disable transfer to address with larger than the maximum ownership", async () => {
      // 21% of 20 billion, hardcoded at the moment
      const transferAmount = "4200000000000000000000000000";

      truffleAssert.reverts(
        // Send 21% of the total existing supply (SHOULD FAIL)
        this.mine.transfer(accounts[1], web3.utils.toBN(transferAmount), {
          from: accounts[0],
        }),
        "MINE: End balance exceeding the maximum ownership percentage of total supply is prohibited!"
      );
    });

    it("Should disable transfer for wallet with balance larger than the decreased maximum ownership percentage (setMaxOwnership)", async () => {
      // 20% of 20 billion, hardcoded at the moment
      const transferAmount = "4000000000000000000000000000";

      await this.mine.setMaxOwnership(15000, { from: accounts[0] });

      truffleAssert.reverts(
        // Send 20% of the total existing supply, but max ownership changed to 15% (SHOULD FAIL)
        this.mine.transfer(accounts[1], web3.utils.toBN(transferAmount), {
          from: accounts[0],
        }),
        "MINE: End balance exceeding the maximum ownership percentage of total supply is prohibited!"
      );
    });

    it("Should disable transfer for wallet with balance larger than the decreased maximum ownership percentage (increaseMaxOwnership)", async () => {
      // 20% of 20 billion, hardcoded at the moment
      const transferAmount = "4000000000000000000000000000";

      await this.mine.decreaseMaxOwnership(5000, { from: accounts[0] });

      truffleAssert.reverts(
        // Send 20% of the total existing supply, but max ownership changed to 15% (SHOULD FAIL)
        this.mine.transfer(accounts[1], web3.utils.toBN(transferAmount), {
          from: accounts[0],
        }),
        "MINE: End balance exceeding the maximum ownership percentage of total supply is prohibited!"
      );
    });
  });

  /**
   * Testing Token Minting with Maximum Ownership Feature:
   * - Should only allow minting to address with less than or equal to the maximum ownership percentage
   * - Should unallow minting to address with greater than the maximum ownership percentage (Whale-Resistance Ownership)
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

      truffleAssert.reverts(
        // Adding 26% of initial supply will result to >20% post ownership (SHOULD FAIL)
        this.mine.mint(accounts[1], web3.utils.toBN(mintAmount), {
          from: accounts[0],
        }),
        "MINE: End balance exceeding the maximum ownership percentage of total supply is prohibited!"
      );
    });
  });
});
