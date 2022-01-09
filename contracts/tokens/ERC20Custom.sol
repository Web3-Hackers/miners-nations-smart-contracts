// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ERC20Custom is
    ERC20,
    ERC20Burnable,
    Ownable,
    ERC20Permit,
    ERC20FlashMint
{
    using SafeMath for uint256;
    uint256 private _cap;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _capSupply
    ) ERC20(_name, _symbol) ERC20Permit(_symbol) {
        require(_capSupply > 0, "ERC20Capped: cap is 0");
        _cap = _capSupply;
    }

    /**
     * @dev Returns the cap on the token's total supply.
     */
    function cap() public view virtual returns (uint256) {
        return _cap;
    }

    /**
     * @dev Set new cap supply
     */
    function setCap(uint256 _newCap) public onlyOwner {
        require(
            _newCap > totalSupply(),
            "ERC20Custom: New cap set to be lower than or equal to total supply!"
        );
        _cap = _newCap;
    }

    /**
     * @dev Increase the cap supply
     */
    function increaseCap(uint256 _increaseCap) public onlyOwner {
        require(
            _increaseCap > 0,
            "ERC20Custom: Increase Cap value has non-valid 0 value!"
        );
        _cap = SafeMath.add(cap(), _increaseCap);
    }

    /**
     * @dev Decrease the cap supply
     */
    function decreaseCap(uint256 _decreaseCap) public onlyOwner {
        require(
            (_decreaseCap > 0) &&
                (_decreaseCap <= SafeMath.sub(cap(), totalSupply())),
            "ERC20Custom: Decrease Cap value has non-valid value!"
        );
        _cap = SafeMath.sub(cap(), _decreaseCap);
    }

    // The following functions are overrides required by Solidity.
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        virtual
        override(ERC20)
    {
        require(
            ERC20.totalSupply() + amount <= cap(),
            "ERC20Capped: cap exceeded"
        );
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        virtual
        override(ERC20)
    {
        super._burn(account, amount);
    }
}
