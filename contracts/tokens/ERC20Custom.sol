// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ERC20Custom is
    ERC20,
    ERC20Burnable,
    Ownable,
    ERC20Permit,
    ERC20Votes,
    ERC20FlashMint
{
    using SafeMath for uint256;
    uint256 private _maximumOwnershipPercentage;

    constructor(string memory _name, string memory _symbol)
        ERC20(_name, _symbol)
        ERC20Permit(_symbol)
    {}

    /**
     * Check whether the
     */
    modifier onlyRestrictedOwnership(address to, uint256 amount) {
        uint256 ReceiverBalance = balanceOf(to);
        require(
            SafeMath.add(amount, ReceiverBalance) >=
                SafeMath.div(SafeMath.mul(totalSupply(), 2), 10),
            "End balance exceeding the maximum ownership percentage of total supply is prohibited!"
        );
        _;
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
        _maximumOwnershipPercentage = _newMaxOwnershipPercentage;
    }

    /**
     * Minting `amount` number of new tokens to `to` address with
     * `onLyRestrictedOwnership` modifier checks
     */
    function mint(address to, uint256 amount)
        public
        onlyOwner
        onlyRestrictedOwnership(to, amount)
    {
        _mint(to, amount);
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
    ) internal override onlyRestrictedOwnership(to, amount) {
        super._beforeTokenTransfer(from, to, amount);
    }

    // The following functions are overrides required by Solidity.
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}
