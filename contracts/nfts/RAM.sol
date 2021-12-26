// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "../tokens/ERC1155Custom.sol";

contract RAMNFT is ERC1155Custom {
    struct RAMDetails {
        uint256 clockSpeed;
        uint8 storageSpace;
        string grade;
    }

    mapping(uint256 => RAMDetails) private _tokenDetails;

    constructor(string memory _uri) ERC1155Custom(_uri) {}

    function getTokenDetails(uint256 id)
        public
        view
        returns (
            uint256,
            uint8,
            string memory
        )
    {
        RAMDetails memory ramDetailsByTokenId = _tokenDetails[id];
        return (
            ramDetailsByTokenId.clockSpeed,
            ramDetailsByTokenId.storageSpace,
            ramDetailsByTokenId.grade
        );
    }

    function setTokenDetails() public onlyOwner {}
}
