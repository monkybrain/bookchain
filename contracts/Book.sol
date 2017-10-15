pragma solidity ^0.4.4;

contract Book {

  address public contributor;
  address public borrower;
  string public isbn;
  uint public price;

  event Borrowed(address borrower);

  function Book(string _isbn, uint _price) {
    contributor = msg.sender;
    borrower = msg.sender;
    isbn = _isbn;
    price = _price;
  }

  function borrow() payable {
    borrower = msg.sender;
    Borrowed(borrower);
  }

}
