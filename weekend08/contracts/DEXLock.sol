// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC20Lock } from "./ERC20Lock.sol";

contract DEXLock {
    ERC20Lock public erc20Lock;

    // Amount of ERC20 tokens exchanged per 1 ETH
    uint256 public exchangeRatio;

    constructor(string memory erc20Name, string memory erc20Symbol, uint256 _exchangeRatio) {
        erc20Lock = new ERC20Lock(erc20Name, erc20Symbol);
        exchangeRatio = _exchangeRatio;
    }

    /// @notice Gives ERC20 tokens based on the amount of ETH sent
    /// @dev This implementation is prone to rounding problems
    function buy() external payable {
        require(msg.value > 0, "Insufficient Amount of ETH");

        erc20Lock.mint(msg.sender, msg.value * exchangeRatio);
    }

    /// @notice Gives ERC20 tokens to specified address on the amount of ETH sent
    /// @dev This implementation is prone to rounding problems
    function buyTo(address to) external payable {
        require(to != address(0), "Invalid To Address");
        require(msg.value > 0, "Insufficient Amount of ETH");

        erc20Lock.mint(to, msg.value * exchangeRatio);
    }

    /// @notice Gives ETH tokens based on the amount of ERC20 tokens sent
    /// @dev This implementation is prone to rounding problems
    function sell(uint256 amount) external {
        require(amount > 0, "Insufficient Amount of ERC20");

        erc20Lock.burnFrom(msg.sender, amount);
        payable(msg.sender).transfer(amount / exchangeRatio);
    }

    /// @notice Gives ETH tokens to specified address based on the amount of ERC20 tokens sent
    /// @dev This implementation is prone to rounding problems
    function sellTo(address to, uint256 amount) external {
        require(to != address(0), "Invalid To Address");
        require(amount > 0, "Insufficient Amount of ERC20");

        erc20Lock.burnFrom(to, amount);
        payable(to).transfer(amount / exchangeRatio);
    }
}
