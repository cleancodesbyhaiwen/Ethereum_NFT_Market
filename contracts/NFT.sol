// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
	constructor() ERC721("Coolest NFT", "NFT") {}

    struct TokenData {
        string name;
        string description;
    }
	enum ListingStatus {
		Active,
		Sold,
		Cancelled
	}

	struct Listing {
		ListingStatus status;
		address seller;
		uint tokenId;
		uint price;
	}

	event Listed(
		uint listingId,
		address seller,
		uint tokenId,
		uint price
	);

	mapping(uint => Listing) private _listings;
		
	mapping(uint256 => TokenData) private _tokenData;

    function mint(address to,uint256 tokenId,string memory name,string memory description) public {
		require(!_exists(tokenId), "Token already exists");
        _safeMint(to, tokenId);
        _setTokenData(tokenId, name, description);
    }

    function getTokenData(uint256 tokenId) public view returns (TokenData memory) {
        return _tokenData[tokenId];
    }

    function _setTokenData(uint256 tokenId, string memory name, string memory description) internal {
        _tokenData[tokenId] = TokenData(name, description);
    }

	function listToken(uint tokenId, uint price, uint listingId) public {
		transferFrom(msg.sender, address(this), tokenId);

		Listing memory listing = Listing(
			ListingStatus.Active,
			msg.sender,
			tokenId,
			price
		);

		_listings[listingId] = listing;
	}

	function getListing(uint listingId) public view returns (Listing memory) {
		return _listings[listingId];
	}

	function buyToken(uint listingId) public payable {
		Listing storage listing = _listings[listingId];

		require(msg.sender != listing.seller, "You are the seller of the item");
		require(listing.status == ListingStatus.Active, "Listing is not active");
		require(msg.value == listing.price, "Payment has to the same as price");

		IERC721(address(this)).transferFrom(address(this), msg.sender, listing.tokenId);

		address payable seller = payable(listing.seller);
		seller.transfer(msg.value);

		listing.status = ListingStatus.Sold;
	}

	function cancel(uint listingId) public {
		Listing storage listing = _listings[listingId];

		require(msg.sender == listing.seller, "Only seller can cancel listing");
		require(listing.status == ListingStatus.Active, "Listing is not active");

		listing.status = ListingStatus.Cancelled;
	
		IERC721(address(this)).transferFrom(address(this), msg.sender, listing.tokenId);
	}
}