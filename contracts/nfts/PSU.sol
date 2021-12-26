// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "../tokens/ERC1155Custom.sol";

contract PSUNFT is ERC1155Custom {
    struct PSUDetails {
        uint8 efficiency;
        uint8 wattage;
        string rating;
        string grade;
    }

    mapping(uint256 => PSUDetails) private _tokenDetails;

    constructor(string memory _uri) ERC1155Custom(_uri) {}

    function getTokenDetails(uint256 id)
        public
        view
        returns (
            uint8,
            uint8,
            string memory,
            string memory
        )
    {
        PSUDetails memory psuDetailsByTokenId = _tokenDetails[id];
        return (
            psuDetailsByTokenId.efficiency,
            psuDetailsByTokenId.wattage,
            psuDetailsByTokenId.rating,
            psuDetailsByTokenId.grade
        );
    }

    function setTokenDetails() public onlyOwner {}
}
