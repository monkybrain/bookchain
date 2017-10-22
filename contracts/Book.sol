pragma solidity ^0.4.18;

contract Book {

  address public contributor;
  address public borrower;
  string public isbn;
  uint public price;

  event Borrowed(address borrower);

  function Book(string _isbn, uint _price) public {
    contributor = msg.sender;
    isbn = _isbn;
    price = _price * (10**18);
  }

  function borrow() payable public {

    // Set sender as new borrower
    borrower = msg.sender;

    // Cap donations to price (return exceeding funds to borrower)
    var remaining = price - (this.balance - msg.value);
    if (msg.value > remaining) {
        var diff = msg.value - remaining;
        if (!msg.sender.send(diff)) revert();
    }

    Borrowed(borrower);
  }

  function getBalance() public view returns(uint) {
     return this.balance;
  }

  function getRemaining() public view returns(uint) {
      return price - this.balance;
  }

}
