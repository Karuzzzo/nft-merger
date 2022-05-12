//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract NFTMerger is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    event TokensMerged(
        uint256 indexed resultingId,
        uint256 token_1,
        uint256 token_2,
        uint256 token_3,
        uint256 token_4,
        uint256 token_5,
        uint256 token_6
    );
    constructor() ERC721("Chopped Human", "CHP") {}
    
    // NOTE URI must be assigned according to rules:
    // itemId mod 6 == 0 => leg 1
    // itemId mod 6 == 1 => leg 2
    // itemId mod 6 == 2 => arm 1
    // itemId mod 6 == 3 => arm 2
    // itemId mod 6 == 4 => body
    // itemId mod 6 == 5 => head

    function mintNFT(address recipient, string memory tokenURI)
        public onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        return newItemId;
    }

    function mergeNFT(uint256[6] calldata ids) public returns (uint256) {
        address sender = msg.sender;

        // Checks for each submitted token
        for (uint8 i = 0; i < 6; i++) {
            uint256 current_id = ids[i];
            require(_exists(current_id), "Submitted non-existing token id");
            require(sender == ownerOf(current_id), "You do not own submitted token");
            require(current_id <= _tokenIds.current(), "Token already merged!");
        }

        // All submitted tokens must form a human being
        require(_formHuman(ids), "Tokens do not form full body!");
        
        // No fails past this point
        
        for (uint8 i = 0; i < 6; i++) {
            _burn(ids[i]);
        }
    
        uint256 merged_id = _generateMergedId(ids);

        _mint(sender, merged_id);

        emit TokensMerged(
            merged_id, 
            ids[0], ids[1], ids[2], ids[3], ids[4], ids[5]
        );
        // Consider truncating ID to fewer bytes, output is unusable in js
        console.log("%s", merged_id);
        return merged_id;
    }

    function _formHuman(uint256[6] calldata ids) internal view returns (bool) {
        // Acc is a bitmask 
        uint8 acc = 0;
        // Bit 0 represents leg1, 1 - leg2, 2 - arm1 etc.
        // Can use keccak here, for more even token distribution
        for (uint8 i = 0; i < 6; i++) {
            // uint8 conversion always safe
            uint8 result = uint8(ids[i] % 6);
            acc = acc | uint8(2 ** result);
            console.log("acc is %s", acc);
        }
        // 0b00111111 - the only valid bitmask
        if (acc == 63) { return true; }
        return false;
    }

    function _generateMergedId(uint256[6] calldata ids) internal pure returns (uint256) {
        // Encode() takes a bit less gas than encodePacked()
        bytes32 acc = keccak256(abi.encode(ids));
        for (uint8 i = 1; i < 6; i++) {
            // XOR hashes for all ids
            acc = acc ^ keccak256(abi.encode(ids[i]));
        }
        return uint256(acc);
    }
}
