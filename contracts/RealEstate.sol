//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RealEstate is ERC721URIStorage {
  using Couinter for Counter.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721Full("MagistriGusti", "MG") {}

  function mint(string memory tokenURL) public returns(uint256) {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(msg.sender, newItemId);
    _setTokenUrl(newItemId, tokenURL);

    return newItemId;
  }

  function totalSupply() public view returns(uint256) {
    return _tokenIds.current();
  }
}
