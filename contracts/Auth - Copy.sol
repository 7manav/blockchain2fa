// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auth {
    mapping(address => bool) private authenticatedUsers;

    function authenticate() public {
        authenticatedUsers[msg.sender] = true;
    }

    function isAuthenticated(address user) public view returns (bool) {
        return authenticatedUsers[user];
    }
}
