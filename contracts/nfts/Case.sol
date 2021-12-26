// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "../tokens/ERC1155Custom.sol";

contract CaseNFT is ERC1155Custom {
    struct CaseDetails {
        string formFactor;
        string airflowGrade;
        string grade;
    }

    mapping(uint256 => CaseDetails) private _tokenDetails;

    constructor(string memory _uri) ERC1155Custom(_uri) {}

    function getTokenDetails(uint256 id)
        public
        view
        returns (
            string memory,
            string memory,
            string memory
        )
    {
        CaseDetails memory caseDetailsByTokenId = _tokenDetails[id];
        return (
            caseDetailsByTokenId.formFactor,
            caseDetailsByTokenId.airflowGrade,
            caseDetailsByTokenId.grade
        );
    }

    function setTokenDetails() public onlyOwner {}
}
