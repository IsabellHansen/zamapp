// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PrivacyToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // 1 million tokens
    uint256 public constant INITIAL_SUPPLY = 100000 * 10**18; // 100k tokens for initial distribution
    
    mapping(address => bool) public whitelist;
    bool public whitelistEnabled = true;
    
    event WhitelistUpdated(address indexed account, bool status);
    event WhitelistToggled(bool enabled);

    constructor() ERC20("PrivacyToken", "PRIV") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
        whitelist[msg.sender] = true;
    }

    modifier onlyWhitelisted() {
        require(!whitelistEnabled || whitelist[msg.sender], "Not whitelisted");
        _;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds maximum supply");
        _mint(to, amount);
    }

    function addToWhitelist(address account) external onlyOwner {
        whitelist[account] = true;
        emit WhitelistUpdated(account, true);
    }

    function removeFromWhitelist(address account) external onlyOwner {
        whitelist[account] = false;
        emit WhitelistUpdated(account, false);
    }

    function addMultipleToWhitelist(address[] calldata accounts) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            whitelist[accounts[i]] = true;
            emit WhitelistUpdated(accounts[i], true);
        }
    }

    function toggleWhitelist() external onlyOwner {
        whitelistEnabled = !whitelistEnabled;
        emit WhitelistToggled(whitelistEnabled);
    }

    function transfer(address to, uint256 amount) public override onlyWhitelisted returns (bool) {
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public override onlyWhitelisted returns (bool) {
        return super.transferFrom(from, to, amount);
    }

    function isWhitelisted(address account) external view returns (bool) {
        return whitelist[account];
    }
}