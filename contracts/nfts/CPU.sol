// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "../tokens/ERC1155Custom.sol";

contract CPUNFT is ERC1155Custom {
    struct CPUDetails {
        uint256 clockSpeed;
        uint8 coreCount;
        uint8 wattage;
        string grade;
    }

    mapping(uint256 => CPUDetails) private _tokenDetails;

    constructor(string memory _uri) ERC1155Custom(_uri) {}

    function getTokenDetails(uint256 id)
        public
        view
        returns (
            uint256,
            uint8,
            uint8,
            string memory
        )
    {
        CPUDetails memory cpuDetailsByTokenId = _tokenDetails[id];
        return (
            cpuDetailsByTokenId.clockSpeed,
            cpuDetailsByTokenId.coreCount,
            cpuDetailsByTokenId.wattage,
            cpuDetailsByTokenId.grade
        );
    }

    function setTokenDetails() public onlyOwner {}
}
