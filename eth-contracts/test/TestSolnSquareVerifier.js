// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
let SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
let SquareVerifier = artifacts.require('SquareVerifier');

contract('SolnSquareVerifier', accounts => {
    // - use the contents from proof.json generated from zokrates steps
    const proofJson = require("./proof.json");

    describe('test solidity contract generated by Zokrates', function () {
        beforeEach(async function () {
            let squareVerifier = await SquareVerifier.new();
            this.contract = await SolnSquareVerifier.new(squareVerifier.address, {from: accounts[0]});
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('new solution can be added for contract', async function () {
            // Arrange
            let result = undefined;
            let tokenId = 10;

            // Act
            let key = await this.contract.generateSolutionKey(
                proofJson.proof.a,
                proofJson.proof.b,
                proofJson.proof.c,
                proofJson.inputs
            );
            result = await this.contract.addSolution(10, accounts[1], key);

            // Assert
            assert.equal(result.logs.length > 0, true, "Verification failed");
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('an ERC721 token can be minted for contract', async function () {
            // Arrange
            let result = undefined;
            let tokenId = 11;

            // Act
            result = await this.contract.mintNFT(
                accounts[2],
                tokenId,
                proofJson.proof.a,
                proofJson.proof.b,
                proofJson.proof.c,
                proofJson.inputs
            );

            // Assert
            assert.equal(result.logs.length > 0, true, "Verification passed");
        })
    });
})
