pragma solidity ^0.4.4;

import "./Library.sol";

contract Book {

  address public contributor;
  address public borrower;
  address public library_address;
  string public isbn;
  uint public price;
  uint public donated;

  event Borrowed(address borrower, uint donation, uint donated);
  event AddedToLibrary(address library_address);

  function Book(string _isbn, uint _price) {
    contributor = msg.sender;
    isbn = _isbn;
    price = _price;
  }

  function addToLibrary(address _library_address) {
    require(msg.sender == contributor);
    library_address = _library_address;
    Library l = Library(library_address);
    l.registerBook(contributor);
    AddedToLibrary(library_address);
  }

  function borrow() payable {
    borrower = msg.sender;
    uint donation = msg.value;
    donated += donation;
    Borrowed(borrower, donation, donated);
  }

}
