//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {SSTORE2} from "solady/src/utils/SSTORE2.sol";
import {Ownable} from "solady/src/auth/Ownable.sol";
import {Base64} from "solady/src/utils/Base64.sol";


import {ToString} from "./libraries/ToString.sol";


//@author promatheus
contract OnchainForMe is ERC721, Ownable, ReentrancyGuard {
  using ToString for uint24;

  uint256 private _tokenId;  

  uint256 private constant MINT_PRICE = 0.007 ether;
  uint256 private immutable _mintEndTime;

  address private _svgHead;
  address private _svgMiddle;

  uint24[6] private _colors = [
    0xffd600,
    0x06d6a0,
    0xef476f,
    0xcdecee,
    0xf91212,
    0x0a56ff
  ];

  struct Token {
    uint256 color;
    address message;
  }

  mapping(uint256 tokenId => Token token) private _tokenData;
  
  event Minted(uint256 indexed tokenId);

  error WrongPrice();
  error MintTimeEnded();
  error InvalidColor();

  constructor(address svgHead, address svgMiddle) ERC721("ONCHAIN FOR ME", "OFM") {
    _mintEndTime = block.timestamp + 14 days;
    _svgHead = svgHead;
    _svgMiddle = svgMiddle;
    _initializeOwner(msg.sender);
  }

  function mint(uint256 color, bytes calldata message) external payable nonReentrant {
    if (color > 5) revert InvalidColor();
    if (block.timestamp > _mintEndTime) revert MintTimeEnded(); 
    if (msg.value != MINT_PRICE) revert WrongPrice();

    unchecked {
      _tokenData[++_tokenId] = Token({
        color: color,
        message: SSTORE2.write(message)
      });
    }

    _mint(msg.sender, _tokenId);

    emit Minted({tokenId: _tokenId});
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    _requireMinted(tokenId);

    Token memory token = _tokenData[tokenId];
    bytes memory message = SSTORE2.read(token.message);

    bytes memory svgHead = SSTORE2.read(_svgHead);
    bytes memory svgMiddle = SSTORE2.read(_svgMiddle);

    return 
      string(
        abi.encodePacked(
          'data:application/json;base64,',
          Base64.encode(
            bytes(
              abi.encodePacked(
                '{"name": "Onchain For Me #',
                ToString.toString(tokenId),
                '", "description": "Early participants in the crypto scene share what onchain means to them.", "image": "data:image/svg+xml;base64,',
                Base64.encode(abi.encodePacked(svgHead, _colors[token.color].toHexStringNoPrefix(3), svgMiddle, message, '</p></div></foreignObject></svg>')),
                '"}'
              )
            )
          )
        )
      );
  }

  function stats() external view returns (uint256, uint256) {
    return (_tokenId, _mintEndTime);
  }

  function updateSvgs(address svgHead, address svgMiddle) external onlyOwner {
    _svgHead = svgHead;
    _svgMiddle = svgMiddle;
  }

  function withdrawBalance() external onlyOwner {
    (bool sent, ) = payable(msg.sender).call{value: address(this).balance}("");
    require(sent, "Withdraw fees error");
  }

}
