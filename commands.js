NFT.deployed().then((instance) => { nft = instance } )
NFT.deployed().then(function(instance){console.log(instance.address)})

let nft = await NFT.at('');

nft.mint("", 3, "token 3", "token number 3")

nft.listToken(3, 3, 3)
nft.getListing(3)

nft.cancel(3)

const paymentAmount = web3.utils.toWei('3', 'ether');
await nft.buyToken(3, { value: paymentAmount });

let owner = await nft.ownerOf(2);
console.log(owner);

nft.transferFrom("", "", 5);