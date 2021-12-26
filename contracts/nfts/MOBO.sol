// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "../tokens/ERC1155Custom.sol";

contract MOBONFT is ERC1155Custom {
    struct MOBODetails {
        string formFactor;
        string grade;
    }

    mapping(uint256 => MOBODetails) private _tokenDetails;

    constructor(string memory _uri) ERC1155Custom(_uri) {}

    function getTokenDetails(uint256 id)
        public
        view
        returns (string memory, string memory)
    {
        MOBODetails memory moboDetailsByTokenId = _tokenDetails[id];
        return (moboDetailsByTokenId.formFactor, moboDetailsByTokenId.grade);
    }

    function setTokenDetails() public onlyOwner {}
}
