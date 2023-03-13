// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract Errors {
    struct Foo {
        address sender;
        uint256 bar;
    }

    error SimpleError(string message);
    error ComplexError(Foo foo, string message, uint256 number);

    uint[] public emptyArray;
    uint[] public nonEmptyArray = [1, 2, 3, 4, 5];

    function overflowRead() public pure returns (uint256) {
        uint256 a = 2 ** 256 - 1;
        uint256 b = 1;
        uint256 c = a + b;
        return c;
    }

    function divideByZeroRead() public pure returns (uint256) {
        uint256 a = 69;
        uint256 b = 0;
        uint256 c = a / b;
        return c;
    }

    function infiniteLoopRead() public pure {
        uint256 i = 0;
        while (true) {
            i++;
        }
    }

    function assertRead() public pure {
        assert(false);
    }

    function requireRead() public pure {
        require(false, "Requirement Not Met");
    }

    function revertRead() public pure {
        revert("This is a revert message");
    }

    function simpleCustomRead() public pure {
        revert SimpleError("bugger");
    }

    function complexCustomRead() public pure {
        revert ComplexError(
            Foo({ sender: 0x0000000000000000000000000000000000000000, bar: 69 }),
            "bugger",
            69
        );
    }

    function overflowWrite() public returns (uint256) {
        uint256 a = 2 ** 256 - 1;
        uint256 b = 1;
        uint256 c = a + b;
        return c;
    }

    function divideByZeroWrite() public returns (uint256) {
        uint256 a = 69;
        uint256 b = 0;
        uint256 c = a / b;
        return c;
    }

    function infiniteLoopWrite() public {
        uint256 i = 0;
        while (true) {
            i++;
        }
    }

    function wrongArrayPositionWrite() public returns (uint) {
        return nonEmptyArray[10];
    }

    function popEmptyArrayWrite() public {
        emptyArray.pop();
    }

    function assertWrite() public {
        assert(false);
    }

    function requireWrite() public {
        require(false);
    }

    function revertWrite() public {
        revert("This is a revert message");
    }

    function simpleCustomWrite() public {
        revert SimpleError("bugger");
    }

    function complexCustomWrite() public {
        revert ComplexError(
            Foo({ sender: 0x0000000000000000000000000000000000000000, bar: 69 }),
            "bugger",
            69
        );
    }
}
