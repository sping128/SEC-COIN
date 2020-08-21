pragma solidity >=0.5.0;
import "./StandardToken.sol";
import "./SafeMath.sol";


contract WhoCoin is StandardToken {
      using SafeMath for uint;
      //Standard state variables
      string public name;
      string public symbol;
      string public version;
      uint public decimals;
      //End standard

      uint public initialPrice;
      address payable funHolder;
      uint public constant WEIS_IN_ETHER = 1E18;

      constructor() public {
            name = "WhoCoin";
            symbol = "WOC";
            version = "1.0";
            decimals = 4;
            _totalSupply = 1000000 * (10 ** decimals);
            initialPrice = 2; // 2 Ethers = 1 Catcoin;
            balances[msg.sender] = _totalSupply;
            funHolder = msg.sender;

      }

      function buyCoin() public payable {  // payable ทำให้ส่งเงินได้
            require(msg.sender != funHolder); // ป้องกันไม่ให้เจ้าของเป็นคนซื้อเหรียญ
            uint coinAmount = (msg.value * 10 ** decimals / WEIS_IN_ETHER) / initialPrice; 
            require(balances[funHolder] >= coinAmount);
            balances[funHolder] = balances[funHolder].sub(coinAmount);
            balances[msg.sender] = balances[msg.sender].add(coinAmount);
            emit Transfer(funHolder, msg.sender, coinAmount);
      }

      function() external payable { //เรียกโดยไม่ผ่าน abi 
            buyCoin();
      }
}