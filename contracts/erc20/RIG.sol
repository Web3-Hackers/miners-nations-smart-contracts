// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "../tokens/ERC20Custom.sol";

contract RIG is ERC20Custom, ERC20Votes {
    constructor() ERC20Custom("RIG Token", "RIG", 100000000000000) {}

    // The following functions are overrides required by Solidity.
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Custom, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20Custom, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Custom, ERC20Votes)
    {
        super._burn(account, amount);
    }
}
