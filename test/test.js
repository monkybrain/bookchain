var Book = artifacts.require("./Book.sol");
var Library = artifacts.require("./Library.sol");

/* Globals */
var book;
var library;
var accounts;

// Get accounts
var accounts = web3.eth.accounts;
var contributor = accounts[0];
var borrower = accounts[1];

/* Mock data */
const isbn = "abc123";
const price = web3.toWei(1, 'ether');
const donation = web3.toWei(1, 'ether');
const registrationFee = web3.toWei(1, 'ether');

/* Events */
var events = {};

before(function() {

  // console.log(web3.eth.getBalance(contributor));

  // Get instance of Library
  return Library.new("Göteborg").then(function(_library) {
    library = _library;
    console.log("Library: " + library.address);
    events.BookRegistered = library.BookRegistered()
    return Book.new(isbn, price, {from: contributor})
  }).then(function(_book) {
    book = _book;
    console.log("Book: "+ book.address);
  });
});

describe('Book', function() {

  it("Should register contributor", function() {
    return book.contributor.call().then(function(_contributor) {
      assert.equal(_contributor, contributor, "not contributor");
    });
  });

  it("Should register isbn", function() {
    return book.isbn.call().then(function(_isbn) {
      assert.equal(isbn, _isbn, "incorrect isbn");
    });
  });

  it("Should register price", function() {
    return book.price.call().then(function(_price) {
      assert.equal(price, _price, "incorrect price");
    });
  });

  it("Should add book to library", function(done) {
    var event = book.AddedToLibrary();
    event.watch(function(err, result) {
      assert.equal(result.args.library_address, library.address, "incorrect library address");
      event.stopWatching();
      done();
    });
    book.addToLibrary(library.address, {from: contributor});
  });

  it("Should register library address", function() {
    return book.library_address.call().then(function(address) {
      assert.equal(library.address, address, "incorrect library address");
    });
  });

  it("Should register borrower and donation", function(done) {
    var event = book.Borrowed()
    event.watch(function(err, result) {
      assert.equal(result.args.borrower, borrower, "incorrect borrower");
      assert.equal(result.args.donation, donation, "incorrect donation");
      assert.equal(result.args.donated, web3.toWei(1, 'ether'), "incorrectly calculated donations");
      event.stopWatching();
      done();
    });
    book.borrow({from: borrower, value: donation});
  });

});

describe('Library', function() {

  it("Should have registered book in previous test", function(done) {
    events.BookRegistered.watch(function(err, result) {
      console.log("FISK!");
      console.log(result);
      events.BookRegistered.stopWatching();
      library.getBooksByContributor.call(contributor).then(function(books) {
        console.log("Registered books:");
        console.log(books);
        assert.equal(book.address, books[0], "no books returned");
        done();
      });

    });
  });

});
