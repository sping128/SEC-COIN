pragma solidity >=0.5.0;
import "./ERC20.sol";
import "./SafeMath.sol";

contract StandardToken is ERC20 {
      using SafeMath for uint; // 256 bit or 32 bytes ใช้ บวกลบตัวแปร
      uint public _totalSupply;
      mapping (address => uint) internal balances; 
      mapping (address => mapping(address => uint)) internal allowed;  // เจ้าของหนึ่งคนอนุญาตได้หลายคน

      function totalSupply() public view returns(uint) {
            return _totalSupply;

      }

      function balanceOf(address owner) public view returns(uint) {
            return balances[owner];
      }
      //ผู้โอนเป็นผู้ call function นี้
      function transfer(address to, uint value) public returns(bool) {
            require(to !=address(0)); // ป้องกันไม่ให้ burn token ทิ้ง, preventing of burning token
            require(balances[msg.sender] >= value);// เงินผู้โอนต้องมีค่ามากกว่าค่าที่จะโอน check whether owner has enough token to transact
            balances[msg.sender] = balances[msg.sender].sub(value);// ผู้โอน balance ลดลง
            balances[to] = balances[to].add(value); // เพิ่มเงินในบัญชีผู้รับ 
            emit Transfer(msg.sender, to, value);
            return true;

      }

      function transferFrom(address from, address to, uint value) public returns(bool) {
            require(to !=address(0)); // ป้องกันไม่ให้ burn token ทิ้ง, preventing of burning token
            require(balances[from] >= value);// เงินผู้โอนต้องมีค่ามากกว่าค่าที่จะโอน check whether owner has enough token to transact
            require(allowed[from][msg.sender] >= value);
            balances[from] = balances[from].sub(value);
            balances[to] = balances[to].add(value);
            allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);
            emit Transfer(from, to, value);
            return true;

      }

      function approve(address spender, uint value) public returns(bool) {
            require(spender != address(0));
            allowed[msg.sender] [spender] = value;
            emit Approval(msg.sender, spender, value);
      }

      function allowance(address owner, address spender) public view returns(uint) {
            return allowed[owner][spender];
      }
}