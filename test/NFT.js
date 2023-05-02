const NFT = artifacts.require('./NFT.sol');

const Web3 = require('web3');
const web3 = new Web3('http://localhost:7545');

contract('NFT', (accounts) => {

    it('successfully mint new NFT with correct name and description', async () => {
        const nft = await NFT.deployed();

        const tokenId = 1;
        const name = "name of token 1";
        const description = "description of token 1";
        await nft.mint(accounts[0],tokenId, name, description, { from: accounts[0] });

        const owner = await nft.ownerOf(tokenId);
        assert.equal(owner, accounts[0], 'Token was not minted to the correct address');
        const tokenData = await nft.getTokenData(tokenId);
        assert.equal(tokenData.name, name, 'Token name was not set correctly');
        assert.equal(tokenData.description, description, 'Token description was not set correctly');
    })


    it('successfully transfer ownership of the token', async () => {
        const nft = await NFT.deployed();

        const tokenId = 2;
        const name = "name of token 2";
        const description = "description of token 2";
        await nft.mint(accounts[1],tokenId, name, description, { from: accounts[1] });

        await nft.transferFrom(accounts[1], accounts[2], tokenId, { from: accounts[1]});
        const owner = await nft.ownerOf(tokenId);
        assert.equal(owner, accounts[2], 'Token was not transferred to destination account');
    })

   
    it('successfully list an token for sale', async () => {
        const nft = await NFT.deployed();

        const tokenId = 3;
        const name = "name of token 3";
        const description = "description of token 3";
        await nft.mint(accounts[3],tokenId, name, description, { from: accounts[3] });

        const price = 1;
        const listingId = 1;
        await nft.listToken(tokenId, price, listingId, { from: accounts[3] });

        const listing = await nft.getListing(listingId);
        assert.equal(listing.price, price, 'Token price is not listed successfully');
        assert.equal(listing.status, 0, 'listing status is not set to ACTIVE');
        assert.equal(listing.seller, accounts[3], 'listing seller is not set correctly');
        assert.equal(listing.tokenId, tokenId, 'listing tokenId is not set correctly');
    })
     
    it('successfully remove an token for listing', async () => {
        const nft = await NFT.deployed();

        const tokenId = 4;
        const name = "name of token 4";
        const description = "description of token 4";
        await nft.mint(accounts[4],tokenId, name, description, { from: accounts[4] });

        const price = 1;
        const listingId = 2;
        await nft.listToken(tokenId, price, listingId, { from: accounts[4] });

        await nft.cancel(listingId, { from: accounts[4] });
        const listing = await nft.getListing(listingId);
        assert.equal(listing.status, 2, 'Token status is not set to CANCELLED');
    })
    
    it('successfully execute a purchase', async () => {
        const nft = await NFT.deployed();

        const tokenId = 5;
        const name = "name of token 5";
        const description = "description of token 5";
        await nft.mint(accounts[5],tokenId, name, description, { from: accounts[5] });

        const price = 1;
        const listingId = 3;
        await nft.listToken(tokenId, price, listingId, { from: accounts[5] });

        const sellerBalanceBefore = await web3.eth.getBalance(accounts[5]);

        await nft.buyToken(listingId, { value: price, from: accounts[6] });
        const owner = await nft.ownerOf(tokenId);
        assert.equal(owner, accounts[6], 'Token was not transferred to buyer account');
        // Assert the correct amount was transferred to the seller
        const sellerBalanceAfter = await web3.eth.getBalance(accounts[5]);
        const amountReceived = BigInt(sellerBalanceAfter) - BigInt(sellerBalanceBefore);
        assert.equal(amountReceived, price, 'The amount received by seller is not the price');
    })
    
    it('can execute an unsuccessful purchase', async () => {
        const nft = await NFT.deployed();

        const tokenId = 6;
        const name = "name of token 6";
        const description = "description of token 6";
        await nft.mint(accounts[7],tokenId, name, description, { from: accounts[7] });

        const price = 1;
        const listingId = 4;
        await nft.listToken(tokenId, price, listingId, { from: accounts[7] });

        try{
            await nft.buyToken(listingId, { value: price-1, from: accounts[8] });
        }catch(error){
            assert(error !== undefined, "There is no error when buying with icorrect amount");
        }
    })

    it('the NFT ownership remains with the first user account and no Ether was transferred', async () => {
        const nft = await NFT.deployed();
        const tokenId = 1;
        const owner = await nft.ownerOf(tokenId);
        assert.equal(owner, accounts[0], 'The ownership of the NFT did not remain with the first user');
        // TODO assert that no ether has been transferred
    })
})