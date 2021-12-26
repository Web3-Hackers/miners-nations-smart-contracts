// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "../tokens/ERC1155Custom.sol";

contract DriveNFT is ERC1155Custom {
    struct DriveDetails {
        uint256 writeSpeed;
        uint256 readSpeed;
        string driveType;
        string grade;
    }

    mapping(uint256 => DriveDetails) private _tokenDetails;

    constructor(string memory _uri) ERC1155Custom(_uri) {}

    function getTokenDetails(uint256 id)
        public
        view
        returns (
            uint256,
            uint256,
            string memory,
            string memory
        )
    {
        DriveDetails memory driveDetailsByTokenId = _tokenDetails[id];
        return (
            driveDetailsByTokenId.writeSpeed,
            driveDetailsByTokenId.readSpeed,
            driveDetailsByTokenId.driveType,
            driveDetailsByTokenId.grade
        );
    }

    function setTokenDetails() public onlyOwner {}
}
