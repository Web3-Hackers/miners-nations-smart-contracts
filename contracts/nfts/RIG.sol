// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "../tokens/ERC721Custom.sol";

contract RIGNFT is ERC721Custom {
    struct RIGDetails {
        uint256 hashRate;
        uint8 gpuTemp;
        uint8 rigTemp;
        uint256 systemPowerLevel;
        string minerOS;
        string grade;
    }

    mapping(uint256 => RIGDetails) private _tokenDetails;

    constructor(string memory _name, string memory _symbol)
        ERC721Custom(_name, _symbol)
    {}

    function getTokenDetails(uint256 id)
        public
        view
        returns (
            uint256,
            uint8,
            uint8,
            uint256,
            string memory,
            string memory
        )
    {
        RIGDetails memory rigDetailsByTokenId = _tokenDetails[id];
        return (
            rigDetailsByTokenId.hashRate,
            rigDetailsByTokenId.gpuTemp,
            rigDetailsByTokenId.rigTemp,
            rigDetailsByTokenId.systemPowerLevel,
            rigDetailsByTokenId.minerOS,
            rigDetailsByTokenId.grade
        );
    }

    function setTokenDetails() public onlyOwner {}
}
