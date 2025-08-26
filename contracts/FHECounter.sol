// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { FHE, euint32 } from "@fhevm/solidity/contracts/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract FHECounter is SepoliaConfig {
    using FHE for euint32;

    euint32 private count;
    address public owner;

    event CounterUpdated(address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        count = FHE.asEuint32(0); // Initialize encrypted counter to 0
    }

    function increment(bytes32 inputEuint32, bytes calldata inputProof) external {
        // Decrypt and verify the input
        euint32 value = FHE.asEuint32(inputEuint32, inputProof);
        
        // Perform homomorphic addition
        count = count.add(value);
        
        emit CounterUpdated(msg.sender);
    }

    function decrement(bytes32 inputEuint32, bytes calldata inputProof) external {
        // Decrypt and verify the input
        euint32 value = FHE.asEuint32(inputEuint32, inputProof);
        
        // Perform homomorphic subtraction
        count = count.sub(value);
        
        emit CounterUpdated(msg.sender);
    }

    function getCount() external view returns (euint32) {
        // Return the encrypted count
        return count;
    }

    function reset() external onlyOwner {
        count = FHE.asEuint32(0);
        emit CounterUpdated(msg.sender);
    }
}