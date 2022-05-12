# NFT-Merger Hardhat Project

This project implements NFT contract logic, designed for merging 6 different NFT with different properties to one big NFT.
This exact contract uses NFTs representing: 

```
leg 1
leg 2
arm 1
arm 2
body
head  
```

Function mergeNFT() burns all 6 of them, creating one big NFT which contains them in one image. 

TokenID of resulting NFT is strictly bound to all 6 of child images.

Backend is required for image generation, tho.

Try running tests, there is some of them:

```shell
npx hardhat test
```
