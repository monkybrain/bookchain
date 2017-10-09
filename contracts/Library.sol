pragma solidity ^0.4.4;

contract Library {

  string public name;
  mapping (address => address[]) public books;
  /*mapping (address => address[]) public books;*/

  event BookRegistered(address book);

  function Library(string _name) {
    name = _name;
  }

  function registerBook(address contributor) {
    var book = msg.sender;
    books[contributor].push(book);
    BookRegistered(book);
  }
  /*function registerBook(address contributor) {
    var book = msg.sender;
    books[contributor].push(book);
    BookRegistered(book);
  }*/

  function getBooksByContributor(address contributor) public returns (address[]) {
      return books[contributor];
  }

}
