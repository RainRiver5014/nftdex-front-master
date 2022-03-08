## Introduction

NFTDEX is a decentraliized application that facilitates multilateral NFT trades of [WAX blockchain](https://developer.wax.io/) using NFT standard  [Simple Assets NFTs](https://github.com/CryptoLions/SimpleAssets).  

NFTDEX.com is the user interface for interacting with the NFTDEX smart contract deployed on WAX account `nftdexnftdex`. 

Access dev app here: http://3.236.68.77:8080/

### NFTs
 NFTs tradable on NFTDEX are first created outside of the application on the WAX blockchain using the SimpleAssets standard. To become eligible for trade on NFTDEX, a user must send a Simple Assets `offer` action of the NFT to account `nftdexnftdex` by submiting Simple Assets action `simpleassets::offer` and passing payload `newowner: nftdexnftdex`. This creates an offer on the `simpleassets offers` table which gives NFTDEX smart contract permissions to the NFT to change ownership to settle a trade. Before an offer or trade can be created, the smart contract searches the simpleassets offers table to make sure the simpleassets offer exists. 
 
`Simple Assets offers` table: https://wax.bloks.io/account/simpleassets?loadContract=true&tab=Tables&account=simpleassets&scope=simpleassets&limit=100&table=offers

Note: `simpleassets offers` are different than `nftdex offers` and should not be confused.

A user can create an NFT `simpleassets offer` to account `nftdexnftdex` within the UI by changing NFT status from "Not For Trade" to "For Trade" from the `NFT` tab of the application. 

- For Trade - NFTs with `simpleassets offer` will be treated as active in the trade marketplace.

- Not For Trade - NFTs without `simpleassets offer` will be treated as inactive and will not be eligible for trade.

Only NFTS "For Trade" are displayed on homepage.

### Offers
 An `offer` can be made by the `offer creator` to offer trade of an owned NFT `offer supply` for another NFT `offer demand` owned by another user. Offers are binding until expiration. When user creates offer on UI, it pushes smartcontract action `offercreate` to create offer in table: https://wax.bloks.io/account/nftdexnftdex?loadContract=true&tab=Tables&account=nftdexnftdex&scope=nftdexnftdex&limit=100

 - Offer Supply - The NFT being offered for trade for another NFT (offer demand) by the offer creator. 

- Offer Demand -  The NFT for which the Supply of a trade is being offered for trade by the offer creator. 

 An offer can be renewed, cancelled, or used to formulate a trade.  



### Options
An option is a trade option identified by the local layer and presented to a user. A user can accept an option through the UI, which pushes smart contract action `optionaccept`, to create a trade offer that is contingent on resulting in trade (or action fails). 

Options are derived by running an algorythm locally that scans offers to identify potential offers that can be made to result in a trade. https://github.com/EOSLAB/option-handler

### Trades
 A trade can be created using 2 or more valid trade offers that together satisfy the terms of all its offers. For example these offers can be combined to create a multilateral trade: 

- a => b 
- b => c
- c => a 

In this example, the former letter represents the offer supply and the latter represents the offer demand. These three combined offers satisfy all the demands of each offer as follows:

- b transferes to owner of a
- a transfers to owner of c
- c transfers to owner of b

A trade results in a change of ownership of NFTs to their respective new owner as result of trade. 

**getpottrades**

Trades are identified by method running on local layer called `getpottrades`. This method runs on local layer anytime the listener hears inline action nftdex::getpottrades. Example: https://wax.bloks.io/transaction/5963f89df3665b21e0d14c31c7528cd8916ce50ff0ca235ad3c2962f1eaccecf?tab=traces

The `getpottrades` method scans through valid offers to identify potential trades. https://github.com/EOSLAB/nftdex-local/blob/32cb6ab175d348e6d0634d23620e975a112e6c7a/app/controllers/nftdex.js

When a trade is identified, it formulates a trade using smart contract action `tradecreate`

<hr /> 

### Anchor Wallet 
The app uses Anchor Wallet to manage keys and sign blockchain transactions: https://greymass.com/en/anchor/download/

Import this private key onto Anchor Wallet, which has a few accounts with NFTs in them so you can play around with it: 5JUVNgLgp6yvzsNHiQJjmm3NDsBMmqpNeYbYV1buecxmngqCV9v

<hr /> 

### dFuse 
The app uses dFuse to stream blockchain data. https://developer.wax.io/en/api-reference/dfuse/dfuse_example.html

<hr /> 

### AWS Server

- Front Layer: ec2-3-236-68-77.compute-1.amazonaws.com
- Local Layer: ec2-18-206-16-196.compute-1.amazonaws.com

<hr /> 

### Smart Contract

See here: https://github.com/EOSLAB/tradestuff-v2/blob/master/README.md

<hr /> 

### Stack Diagram: 

![NFTDEX Workflow](https://user-images.githubusercontent.com/38477711/154884496-135dbdc2-62da-4724-8705-b3f67d4258e7.png)

"# nftdex-front-master" 
