const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    let buyer, seller, inspector, lender;
    let realEstate, escrow;

    beforeEach(async () => {
        [buyer, seller, inspector, lender] = await ethers.getSigners();
       

        const RealEstate = await ethers.getContractFactory('RealEstate');
        realEstate = await RealEstate.deploy();

        let transaction = await realEstate.mint("https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/1.png");
        await transaction.wait();

        const Escrow = await ethers.getContractFactory('Escrow');
        escrow = await Escrow.deploy(
            realEstate.address,
            seller.address,
            inspector.address,
            lender.address
        );
    });

    describe('Deployment', () => {
        it("returns NFT address", async () => {
            const result = await escrow.nftAddress();
            expect(result).to.be.equal(realEstate.address);
        });
    
        it("returns seller", async () => {
            const result = await escrow.seller();
            expect(result).to.be.equal(seller.address);
        });
    
        it("returns inspector", async() => {
            const result = await escrow.inspector();
            expect(result).to.be.equal(inspector.address);
        });
    
        it("returns lender", async () => {
            const result = await escrow.lender();
            expect(result).to.be.equal(lender.address);
        });
    })

    it("save the adresses", async () => {
        
    });
})















// "image": "https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/1.png",