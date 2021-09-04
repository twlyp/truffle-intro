// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

contract VolcanoToken is ERC721, Ownable {
	using Counters for Counters.Counter;
	Counters.Counter private tokenID;

	struct Token {
		uint256 id;
		uint256 timestamp;
		string URI;
	}

	mapping(address => Token[]) public tokens;

	constructor() ERC721("VolcanoToken", "VLT") {}

	/**
	 * @dev mints a new token to the sender
	 * @return ID of the minted token
	 */
	function mint() public returns (uint256) {
		uint256 currentID = Counters.current(tokenID);
		_safeMint(msg.sender, currentID);
		tokens[msg.sender].push(
			Token({
				id: currentID,
				timestamp: block.timestamp,
				URI: "some placeholder"
			})
		);
		Counters.increment(tokenID);
		return currentID;
	}

	/**
	 * @dev burns the token with the given ID if the sender is authorized
	 * @param _id ID of the token to be burnt
	 */
	function burn(uint256 _id) public {
		address owner_ = ownerOf(_id);
		require(owner_ == msg.sender, "you are not allowed to burn this token");
		_burn(_id);
		deleteData(owner_, _id);
	}

	/**
	 * @dev deletes the metadata corresponding to the given token ID
	 * @param _owner address of the owner
	 * @param _id ID of the token to be deleted
	 */
	function deleteData(address _owner, uint256 _id) internal {
		Token[] storage tokens_ = tokens[_owner];
		for (uint256 i = 0; i < tokens_.length; i++) {
			if (tokens_[i].id == _id) {
				delete tokens_[i];
				break;
			}
		}
	}
}
