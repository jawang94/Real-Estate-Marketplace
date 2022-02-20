pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./Verifier.sol";

// define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {

}

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
// TODO define a solutions struct that can hold an index & an address
// TODO define an array of the above struct
// TODO define a mapping to store unique solutions submitted
// TODO Create an event to emit when a solution is added
// TODO Create a function to add the solutions to the array and emit the event
// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
contract SolnSquareVerifier is JSONToken {
    SquareVerifier squareVerifier;

    constructor() public {
        squareVerifier = SquareVerifier(msg.sender);
    }

    struct Solution {
        uint256 index;
        address _address;
    }

    Solution[] solutions;

    mapping(bytes32 => Solution) submittedSolutions;

    event SolutionAdded(uint256 index, address _address);

    event TokenMinted(uint256 index, address _address);

    function addSolution(
        uint256 _index,
        address _address,
        bytes32 key
    ) public {
        Solution memory solution = Solution(_index, _address);
        submittedSolutions[key] = solution;
        solutions.push(solution);
        emit SolutionAdded(_index, _address);
    }

    function mintNFT(
        address to,
        uint256 tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        bool verified = squareVerifier.verifyTx(a, b, c, input);
        require(verified, "Verification failed");

        bytes32 _key = generateKey(a, b, c, input);
        require(
            submittedSolutions[_key]._address == address(0x0),
            "Solution exists"
        );

        addSolution(tokenId, to, _key);
        super.mint(to, tokenId);
        emit TokenMinted(tokenId, to);
    }

    function generateKey(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(a, b, c, input));
    }
}
