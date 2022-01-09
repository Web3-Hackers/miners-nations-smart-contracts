// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "../tokens/ERC20Custom.sol";

contract MINE is ERC20Custom {
    enum TokenOperation {
        MINT,
        TRANSFER
    }

    /**
     * @dev Represents the Maximum Ownership percentage a wallet can hold MINE Token
     *
     * NOTE: At the moment, we will be using 3 decimals for the calculation
     */
    uint256 private _maximumOwnershipPercentage;

    constructor(
        address _multisigWallet,
        uint256 _maximumOwnershipPercentageInput
    )
        ERC20Custom(
            "MINE Token",
            "MINE",
            SafeMath.mul(2, 10**(10 + decimals())) // 20 Billion has 10 zeroes
        )
    {
        _mint(_multisigWallet, SafeMath.mul(2, 10**(10 + decimals())));
        _maximumOwnershipPercentage = _maximumOwnershipPercentageInput;
    }

    /**
     * @dev Check whether the post operation balance is less than or equal to the
     * maximum ownership percentage
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
                "MINE: End balance exceeding the maximum ownership percentage of total supply is prohibited!"
            );
        }
        _;
    }

    /**
     * @dev Calculate the total supply of token post-operation (TRANSFER or MINT)
     */
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
     * @dev Return the Maximum Ownership Percentage of an address
     */
    function maxOwnership() public view returns (uint256) {
        return _maximumOwnershipPercentage;
    }

    /**
     * @dev Set the Maximum Ownership Percentage with new `_newMaxOwnershipPercentage` value,
     * that can only be passed by the owner/admin of the contract
     */
    function setMaxOwnership(uint256 _newMaxOwnershipPercentage)
        external
        onlyOwner
    {
        require(
            _newMaxOwnershipPercentage > 0 &&
                _newMaxOwnershipPercentage <= 100000,
            "MINE: New Max Ownership Percentage must be larger than 0 or at most 100% (5 decimals)"
        );
        _maximumOwnershipPercentage = _newMaxOwnershipPercentage;
    }

    /**
     * @dev Minting `amount` number of new tokens to `to` address with
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
     * @dev Add `onlyRestrictedOwnership` modifier to check beforehand whether the total
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
