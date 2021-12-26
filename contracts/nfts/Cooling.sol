// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "../tokens/ERC1155Custom.sol";

contract CoolingNFT is ERC1155Custom {
    struct CoolingDetails {
        uint256 fanSpeed;
        uint8 fanCount;
        string coolerType;
        string coolantType;
        string coolingMethod;
        string grade;
    }

    mapping(uint256 => CoolingDetails) private _tokenDetails;

    constructor(string memory _uri) ERC1155Custom(_uri) {}

    function getTokenDetails(uint256 id)
        public
        view
        returns (
            uint256,
            uint8,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        CoolingDetails memory coolingDetailsByTokenId = _tokenDetails[id];
        return (
            coolingDetailsByTokenId.fanSpeed,
            coolingDetailsByTokenId.fanCount,
            coolingDetailsByTokenId.coolerType,
            coolingDetailsByTokenId.coolantType,
            coolingDetailsByTokenId.coolingMethod,
            coolingDetailsByTokenId.grade
        );
    }

    function setTokenDetails() public onlyOwner {}
}
