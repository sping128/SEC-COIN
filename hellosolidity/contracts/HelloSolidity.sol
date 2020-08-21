pragma solidity >=0.5.0;
// comment
/* multi-line comment */

contract HelloSolidity {

    // state variable
    uint public myValue;
    constructor() public {
        myValue = 5;
    }

    function increase() public { // Transactional call: มีการอัพเดต state variable
        myValue++;
    }

    function decrease() public {
        myValue--;
    }

    function setValue(uint newValue) public {
        myValue = newValue;
    }

    function getValue() public returns (uint) { // Non-transactional call
        return myValue;
    }

    function myFunc(uint a, uint b) public pure returns (uint, uint) { // Pure function: ไม่ได้ยุ่งเกี่ยวกับ state variable, คำนวณอย่างเดียว
        return (a * b, a + b);
    }
}