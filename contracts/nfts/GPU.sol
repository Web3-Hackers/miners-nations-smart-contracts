// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "../tokens/ERC1155Custom.sol";

contract GPUNFT is ERC1155Custom {
    struct GPUDetails {
        uint256 gpuClock;
        string memoryType;
        uint8 memorySize;
        uint8 fanCount;
        uint256 wattage;
        string grade;
    }

    mapping(uint256 => GPUDetails) private _tokenDetails;

    constructor(string memory _uri) ERC1155Custom(_uri) {}

    function getTokenDetails(uint256 id)
        public
        view
        returns (
            uint256,
            string memory,
            uint8,
            uint8,
            uint256,
            string memory
        )
    {
        GPUDetails memory gpuDetailsByTokenId = _tokenDetails[id];
        return (
            gpuDetailsByTokenId.gpuClock,
            gpuDetailsByTokenId.memoryType,
            gpuDetailsByTokenId.memorySize,
            gpuDetailsByTokenId.fanCount,
            gpuDetailsByTokenId.wattage,
            gpuDetailsByTokenId.grade
        );
    }

    function setTokenDetails() public onlyOwner {}
}
