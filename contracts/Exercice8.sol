
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Payment {
    address public recipient;

    constructor(address _recipient) {
        recipient = _recipient;
    }

    function receivePayment() public payable {
        require(msg.value > 0, "La valeur envoyee doit etre superieure a 0");
    }

    function withdraw() public {
        require(msg.sender == recipient, "Seul le destinataire peut retirer les fonds");
        
        uint amount = address(this).balance;
        require(amount > 0, "Pas de fonds a retirer");

        payable(recipient).transfer(amount);
    }

    function getRecipient() public view returns (address) {
        return recipient;
    }
}
