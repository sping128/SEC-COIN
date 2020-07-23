pragma solidity >=0.5.0;
import "./ERC20.sol";
import "./SafeMath.sol";

contract StandardToken is ERC20 {
    using SafeMath for uint; // 256 bits or 32 bytes
    uint public _totalSupply;
    mapping (address => uint) internal balances;
    mapping (address => mapping(address => uint)) internal allowed; // A -> B -> C: A allows B to use up to C

    function totalSupply() public view returns (uint) {
        return _totalSupply;
    }

    function balanceOf(address owner) public view returns (uint) {
        return balances[owner];
    }

    function transfer(address to, uint value) public returns (bool) {
        require(to != address(0)); // preventing of buring token
        require(balances[msg.sender] >= value); // check whether owner has enough token to transfer
        balances[msg.sender] = balances[msg.sender].sub(value);
        balances[to] = balances[to].add(value);
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint value) public returns (bool) {
        require(to != address(0));
        require(balances[from] >= value);
        require(allowed[from][msg.sender] >= value); // check whether allowance is enough
        balances[from] = balances[from].sub(value);
        balances[to] = balances[to].add(value);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);
        emit Transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint value) public returns (bool) {
        require(spender != address(0));
        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender,  value);
    }

    function allowance(address owner, address spender) public view returns (uint) {
        return allowed[owner][spender];
    }

}