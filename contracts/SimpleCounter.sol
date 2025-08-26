// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SimpleCounter {
    uint256 private count;
    address public owner;

    event CounterUpdated(uint256 newCount, address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        count = 0;
    }

    function increment(uint256 value) external {
        count += value;
        emit CounterUpdated(count, msg.sender);
    }

    function decrement(uint256 value) external {
        require(count >= value, "Cannot subtract more than current count");
        count -= value;
        emit CounterUpdated(count, msg.sender);
    }

    function getCount() external view returns (uint256) {
        return count;
    }

    function reset() external onlyOwner {
        count = 0;
        emit CounterUpdated(count, msg.sender);
    }
}