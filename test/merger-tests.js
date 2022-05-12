const chai = require("chai");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);

const nft_list = [1, 2, 3, 4, 5, 6]

describe("Deployment", function () {
    let merger;
    let signer;
    let signer2;
    beforeEach(async function () {
        [preset_signer, preset_signer2] = await ethers.getSigners();
        
        const Merger = await ethers.getContractFactory("NFTMerger");
        const _merger = await Merger.deploy();
        await _merger.deployed();
        merger = _merger;
        signer = preset_signer;
        signer2 = preset_signer2;
    });

    it("should mint tokens", async function () {
        for (i = 0; i < 8; i++) { 
            await merger.connect(signer).mintNFT(signer.address, "");
        }
        expect(await merger.connect(signer).balanceOf(signer.address)).to.equal(8);
    });

    it("should merge tokens", async function () {
        for (i = 0; i < 8; i++) { 
            await merger.connect(signer).mintNFT(signer.address, "");
        }
        await merger.connect(signer).mergeNFT(nft_list);
        // 6 of 8 was removed
        expect(await merger.connect(signer).balanceOf(signer.address)).to.equal(3);
    });

    it("try merge bad tokens", async function () {
        for (i = 0; i < 8; i++) { 
            await merger.connect(signer).mintNFT(signer.address, "");
        }
        await expect(merger.connect(signer).mergeNFT([0, 1, 50, 2, 6, 2]))
            .to.be.revertedWith('Submitted non-existing token id');
    });

    it("try merge someone's token", async function () {
        for (i = 0; i < 8; i++) { 
            await merger.connect(signer).mintNFT(signer.address, "");
        }
        await merger.connect(signer).mintNFT(signer2.address, "");
        await merger.connect(signer).transferFrom(signer.address, signer2.address, 3);
        await expect(merger.connect(preset_signer).mergeNFT([1, 2, 3, 4, 5, 6]))
            .to.be.revertedWith('You do not own submitted token');
        ;
    });

    it("try merge merged token", async function () {
        for (i = 0; i < 15; i++) { 
            await merger.connect(signer).mintNFT(signer.address, "");
        }
        await merger.connect(signer).mintNFT(signer2.address, "");
        await merger.connect(preset_signer).mergeNFT([1, 2, 3, 4, 5, 6]);
        // IDK merged tokenIDs are way too big, consider truncating to bytes2 or something
        await merger.connect(preset_signer).mergeNFT([7, 8, 9, 10, 11, 12341]);
    });
    // IDK think later

});
