// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Lock is ERC20, ERC20Burnable, Pausable, Ownable {
    struct Lock {
        uint256 lockedAmount;
        uint unlockBlockNumber;
    }

    mapping(address => Lock[]) public lockedAmounts;

    mapping(address => mapping(address => uint256)) private _allowance;

    event AmountLocked(address indexed account, uint256 lockedAmount, uint unlockBlockNumber);

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    modifier hasEnoughUnlockedBalance(address account, uint256 amount) {
        uint256 unlockedBalance = _getUnlockedBalance(account);
        require(unlockedBalance >= amount, "Not Enough Unlocked Balance");
        _;
    }

    // External Functions - Lock Protected

    function getLockedAmount(address account) external view returns (uint256) {
        return _getLockedBalance(account);
    }

    function getUnlockedAmount(address account) external view returns (uint256) {
        return _getUnlockedBalance(account);
    }

    function lockAmount(
        uint256 amount,
        uint unlockBlockNumber
    ) external hasEnoughUnlockedBalance(msg.sender, amount) returns (bool) {
        require(block.number < unlockBlockNumber, "Invalid Unlock Block Number");

        lockedAmounts[msg.sender].push(Lock(amount, unlockBlockNumber));

        emit AmountLocked(msg.sender, amount, unlockBlockNumber);
        return true;
    }

    // Public Functions - Lock Protected

    function transfer(
        address to,
        uint256 amount
    ) public override hasEnoughUnlockedBalance(msg.sender, amount) returns (bool) {
        super.transfer(to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override hasEnoughUnlockedBalance(from, amount) returns (bool) {
        super.transferFrom(from, to, amount);
        return true;
    }

    function burn(uint256 amount) public override hasEnoughUnlockedBalance(msg.sender, amount) {
        super.burn(amount);
    }

    function burnFrom(
        address from,
        uint256 amount
    ) public override hasEnoughUnlockedBalance(from, amount) {
        super.burnFrom(from, amount);
    }

    // External Functions - Ownership Protected

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Internal Functions

    function _getLockedBalance(address account) internal view returns (uint256) {
        uint256 lockedBalance = 0;

        for (uint i = 0; i < lockedAmounts[account].length; i++) {
            if (block.number < lockedAmounts[account][i].unlockBlockNumber) {
                lockedBalance = lockedBalance + lockedAmounts[account][i].lockedAmount;
            }
        }

        return lockedBalance;
    }

    function _getUnlockedBalance(address account) internal view returns (uint256) {
        return balanceOf(account) - _getLockedBalance(account);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
