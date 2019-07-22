pragma solidity >=0.5.0 <0.6.0;

contract SelfDestruct {

  address public owner;
  address payable constant public target = 0x0c532687EaBE667b8ba27fC024783CA9fffd1cAE;

  constructor() public {
    owner = msg.sender;
  }

  function selfDestruct() public payable {
    require(msg.sender == owner);
    selfdestruct(target);
  }

}
