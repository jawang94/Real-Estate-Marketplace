let ERC721MintableJSONToken = artifacts.require('JSONToken');

contract('TestERC721Mintable', accounts => {
    const account_one = accounts[0];
    const account_two = accounts[1];
    const totalTokens = 10;
    const tokenCount = [];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableJSONToken.new({ from: account_one });
            tokenCount[account_one] = 0;
            tokenCount[account_two] = 0;

            // TODO: mint multiple tokens
            let account = account_one;

            for (let i = 1; i <= totalTokens; i++) {
                this.contract.mint(account, i);
                tokenCount[account] = tokenCount[account] + 1;
                account = account === account_one ? account_two : account_one;
            }
        })

        it('should return total supply', async function () {
            const totalNumbers = totalTokens;
            const totalSupply = await this.contract.totalSupply();
            assert.equal(totalNumbers, totalSupply, "Total supply does not match");
        })

        it('should get token balance', async function () {
            const acc_one_bal = tokenCount[account_one];
            const acc_two_bal = tokenCount[account_two];

            const accountOneBalance = await this.contract.balanceOf(account_one);
            const accountTwoBalance = await this.contract.balanceOf(account_two);

            assert.equal(acc_one_bal, accountOneBalance, "Acc_1 balance does not match");
            assert.equal(acc_two_bal, accountTwoBalance, "Acc_2 balance does not match");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
          const baseURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';

            for (let i = 1; i <= totalTokens; i++) {
                const tokenURI = await this.contract.tokenURI(i);
                assert.equal(tokenURI, baseURI + i, "Token URI does not match");
            }
        })

        it('should transfer token from one owner to another', async function () {
            const owner = await this.contract.ownerOf(1);
            const receiver = owner === account_one ? account_two : account_one;

            await this.contract.transferFrom(owner, receiver, 1);
            const recipient = await this.contract.ownerOf(1);

            assert.equal(receiver, recipient, "Token not transferred");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableJSONToken.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {
            const tokenId = 6;
            const result = undefined;
            const notContractOwner = account_two;

            try {
                result = await this.contract.mint(account_one, tokenId, {from: notContractOwner});
            } catch (e) {
                result = false;
            }

            assert.equal(result, false, "Minting address is not contract owner");
        })

        it('should return contract owner', async function () {
            const owner = account_one;
            const result = await this.contract.getOwner();
            assert.equal(result, owner, "This is not a proper owner");
        })
    });
})
