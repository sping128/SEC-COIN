pragma solidity >=0.5.0;
//comment
contract HelloSolidity {

      uint public myValue;

      constructor() public {
            myValue = 5;
      }

      function increase() public {
            myValue++;
      }

      function setValue(uint newValue) public {
            myValue = newValue;
      }

      function getValue() public view returns (uint) {
            return myValue;
      }

      function decrease() public {
            myValue--;
      }
      function myFunc(uint a, uint b) public pure returns (uint, uint) {
            return (a*b, a+b);
      }

}