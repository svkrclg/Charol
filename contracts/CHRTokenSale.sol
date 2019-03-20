pragma solidity 0.5.0;

import "./CHRToken.sol";
//import "/openzeppelin-solidity/contracts/math/SafeMath.sol";
contract CHRTokenSale {
    address admin;
    CHRToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;
   // using SafeMath for uint256;
    event Sell(address _buyer, uint256 _amount);

    constructor (CHRToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b);

        return c;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {   
        uint256 x=mul(_numberOfTokens, tokenPrice); 
        require(msg.value == x);
        require(tokenContract.balanceOf(admin) >= _numberOfTokens);
        tokenContract.transfer(admin, msg.sender, _numberOfTokens);
        tokensSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }
    function endSale() public {
        require(msg.sender == admin);   
        
    }
   /* string public senderString;

 function addressToString(address _addr) public pure returns(string memory) {
    bytes32 value = bytes32(uint256(_addr));
    bytes memory alphabet = "0123456789abcdef";

    bytes memory str = new bytes(42);
    str[0] = '0';
    str[1] = 'x';
    for (uint i = 0; i < 20; i++) {
        str[2+i*2] = alphabet[uint(value[i + 12] >> 4)];
        str[3+i*2] = alphabet[uint(value[i + 12] & 0x0f)];
    }
    senderString=string(str);
    return string(str);
}*/
}