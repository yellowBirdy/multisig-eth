//SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract Wallet {
    address[] public approvers;
    uint public quorum;
    
    struct Transfer {
        uint id;
        address payable to;
        uint approvals;
        uint amount;
        bool sent;
    }
    Transfer[] public transfers;
    //@dev trnasfer approvals track approver address to transfer
    mapping (address => mapping(uint => bool)) public approvals;
    
    constructor (address[] memory _approvers, uint _quorum) public {
        approvers = _approvers;
        quorum = _quorum;
    }
    //@dev returns id of the transfer
    function propose (address payable _to, uint _amount) external onlyApprover() returns(uint) {
        uint id = transfers.length;
        transfers.push(Transfer(
            id,
            _to,
            1,
            _amount,
            false
        ));
        approvals[msg.sender][id] = true;
        return id;
    }
    //@dev returns if transfer sent
    function approve (uint _id) external onlyApprover() returns(bool) {
        require(transfers[_id].sent == false, "Transfer already fullfiled.");
        require(approvals[msg.sender][_id] == false, "Can't approve twice.");
        Transfer storage trans = transfers[_id];
        trans.approvals++;
        approvals[msg.sender][_id] = true;
        if (trans.approvals >= quorum) {
            address payable recipient = transfers[_id].to;
            uint amount = trans.amount;
            recipient.transfer(amount);
            trans.sent = true;
        }
        return trans.approvals >= quorum;
    }
    
    function getApprovers() public view returns (address[] memory) {
        return approvers;
    }
    function getTransfers() public view returns (Transfer[] memory) {
        return transfers;
    }
    
    
    modifier onlyApprover() {
        bool approver = false;
        for (uint i; i < approvers.length; i++) {
            if (msg.sender == approvers[i]) {
                approver = true;
            }
        }
        require(approver == true, "Can only be called by an approver.");
        _;
    }
    
    receive() external payable {}    
    
}
