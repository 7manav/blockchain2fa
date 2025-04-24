// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TwoFA {
    mapping(address => string) public user2FAKey;

    // Set the 2FA key (public/private key)
    function set2FAKey(string memory _key) public {
        user2FAKey[msg.sender] = _key;
    }

    // Verify 2FA key (simple check)
    function verify2FA(address user, string memory _key) public view returns (bool) {
        return keccak256(abi.encodePacked(user2FAKey[user])) == keccak256(abi.encodePacked(_key));
    }
}
