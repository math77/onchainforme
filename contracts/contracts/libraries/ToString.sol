// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

library ToString {

  bytes16 private constant ALPHABET = "0123456789abcdef";

  function toString(uint256 value) internal pure returns (string memory) {
    // Inspired by OraclizeAPI's implementation - MIT license
    // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

    if (value == 0) {
      return "0";
    }
    uint256 temp = value;
    uint256 digits;
    while (temp != 0) {
      digits++;
      temp /= 10;
    }
    bytes memory buffer = new bytes(digits);
    while (value != 0) {
      digits -= 1;
      buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
      value /= 10;
    }
    return string(buffer);
  }

  /**
   From https://github.com/Area-Technology/shields-contracts/blob/main/contracts/libraries/HexStrings.sol
  */
  function toHexStringNoPrefix(uint256 value, uint256 length) internal pure returns (string memory) {
    bytes memory buffer = new bytes(2 * length);
    for (uint256 i = buffer.length; i > 0; i--) {
      buffer[i - 1] = ALPHABET[value & 0xf];
      value >>= 4;
    }
    return string(buffer);
  }
}