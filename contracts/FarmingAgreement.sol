// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract FarmingAgreement {
    address public admin;
    
    struct Agreement {
        address farmer;
        address buyer;
        uint256 cropQuantity;
        uint256 price;
        bool approved;
    }

    Agreement[] public agreements;

    event AgreementCreated(uint256 id, address farmer, address buyer);

    constructor() {
        admin = msg.sender; // Set admin to the deployer's address
    }

    // Ensure this function is 'payable' to accept Ether
    function createAgreement(address _farmer, address _buyer, uint256 _cropQuantity, uint256 _price) public payable {
        require(msg.sender == admin, "Only the admin can create agreements");
        require(msg.value == _price, "Incorrect payment amount"); // Verify that the sent Ether matches the price

        uint256 agreementId = agreements.length;
        agreements.push(Agreement({
            farmer: _farmer,
            buyer: _buyer,
            cropQuantity: _cropQuantity,
            price: _price,
            approved: false
        }));

        // Transfer Ether to the farmer
        payable(_farmer).transfer(msg.value);

        emit AgreementCreated(agreementId, _farmer, _buyer);
    }

    function approveAgreement(uint256 _agreementId) public {
        require(msg.sender == admin, "Only the admin can approve agreements");

        Agreement storage agreement = agreements[_agreementId];
        agreement.approved = true;
    }

    function getAgreement(uint256 _agreementId) public view returns (address, address, uint256, uint256, bool) {
        Agreement storage agreement = agreements[_agreementId];
        return (agreement.farmer, agreement.buyer, agreement.cropQuantity, agreement.price, agreement.approved);
    }
}
