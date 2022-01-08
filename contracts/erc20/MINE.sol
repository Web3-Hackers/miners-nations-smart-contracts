// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../tokens/ERC20Custom.sol";

contract MINE is ERC20Custom {
    using SafeMath for uint256;
    enum TokenOperation {
        MINT,
        TRANSFER
    }

    /**
     * Represents the Maximum Ownership percentage a wallet can hold MINE Token
     *
     * NOTE: At the moment, we will be using 3 decimals for the calculation
     */
    uint256 private _maximumOwnershipPercentage;

    constructor(uint256 _maximumOwnershipPercentageInput)
        ERC20Custom("MINE Token", "MINE")
    {
        _maximumOwnershipPercentage = _maximumOwnershipPercentageInput;
    }

    /**
     * Check whether the
     */
    modifier onlyRestrictedOwnership(
        address to,
        uint256 amount,
        TokenOperation tokenOperation
    ) {
        uint256 ReceiverBalance = balanceOf(to);
        // Don't need to check when first minting
        if (totalSupply() != 0) {
            uint256 tokenSupplyPostOperation = calculateTotalSupplyByTokenOperation(
                    amount,
                    tokenOperation
                );
            require(
                SafeMath.add(amount, ReceiverBalance) <=
                    // Divided by 100000 because it is using 3 decimals and represented as a percentage (2 decimals)
                    SafeMath.div(
                        SafeMath.mul(
                            tokenSupplyPostOperation,
                            _maximumOwnershipPercentage
                        ),
                        100000
                    ),
                "End balance exceeding the maximum ownership percentage of total supply is prohibited!"
            );
        }
        _;
    }

    function calculateTotalSupplyByTokenOperation(
        uint256 mintedAmount,
        TokenOperation tokenOperation
    ) internal view returns (uint256) {
        if (tokenOperation == TokenOperation.MINT) {
            return totalSupply() + mintedAmount;
        } else {
            return totalSupply();
        }
    }

    /**
     * Return the Maximum Ownership Percentage of an address
     */
    function maxOwnership() public view returns (uint256) {
        return _maximumOwnershipPercentage;
    }

    /**
     * Set the Maximum Ownership Percentage with new `_newMaxOwnershipPercentage` value,
     * that can only be passed by the owner/admin of the contract
     */
    function setMaxOwnership(uint256 _newMaxOwnershipPercentage)
        external
        onlyOwner
    {
        require(
            _newMaxOwnershipPercentage <= 100000,
            "New Max Ownership Percentage must be at most 100% (5 decimals)"
        );
        _maximumOwnershipPercentage = _newMaxOwnershipPercentage;
    }

    /**
     * Minting `amount` number of new tokens to `to` address with
     * `onLyRestrictedOwnership` modifier checks
     */
    function mint(address to, uint256 amount)
        public
        onlyOwner
        onlyRestrictedOwnership(to, amount, TokenOperation.MINT)
    {
        _mint(to, amount);
    }

    function transfer(address to, uint256 amount)
        public
        override
        onlyRestrictedOwnership(to, amount, TokenOperation.TRANSFER)
        returns (bool)
    {
        return super.transfer(to, amount);
    }

    /**
     * Add `onlyRestrictedOwnership` modifier to check beforehand whether the total
     * accumulation exceeds the maxiumum ownership percentage, represented by
     * `_maxOwnership` variable
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._beforeTokenTransfer(from, to, amount);
    }
}
