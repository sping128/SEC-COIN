pragma solidity >=0.5.0;
import "./StandardToken.sol";
import "./SafeMath.sol";

contract CatCoin is StandardToken {
    using SafeMath for uint;
    // Standard state variables
    string public name;
    string public symbol;
    string public version;
    uint public decimals;

    uint public initialPrice;
    address payable fundHolder;
    uint public constant WEIS_IN_ETHER = 1E18;

    constructor() public {
        name = "CatCoin";
        symbol = "CCN";
        version = "1.0";
        decimals = 4;
        _totalSupply = 1000000 * (10 ** decimals);  // 10^4 is for 4 decimals
        initialPrice = 2; // 2 Ether = 1 Catcoin
        balances[msg.sender] = _totalSupply;        // มี CatCoin coins ทั้งหมด
        fundHolder = msg.sender;
    }

    function buyCoin() public payable { // payable บอกว่า มีการส่งเงินได้
        require(msg.sender != fundHolder);
        // msg.value is in Wei
        uint coinAmount = (msg.value / WEIS_IN_ETHER * (10 ** decimals)) / initialPrice;
        require(balances[fundHolder] >= coinAmount);
        balances[fundHolder] = balances[fundHolder].sub(coinAmount);
        balances[msg.sender] = balances[msg.sender].add(coinAmount);
        emit Transfer(fundHolder, msg.sender, coinAmount);
    }

    function() external payable {
        buyCoin();
    }

}