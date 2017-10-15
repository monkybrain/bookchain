var Book = artifacts.require("./Book.sol");

/* Globals */
var book;
var accounts;

// Get accounts
var accounts = web3.eth.accounts;
var contributor = accounts[0];
var borrower = accounts[1];
var borrower2 = accounts[2];

/* Mock data */
const isbn = "abc123";
const price = web3.toWei(1, 'ether');

/* Events */
var events = {};

before(function() {
  // Get instance of Library
  return Book.new(isbn, price, {from: contributor}).then(function(_book) {
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
      assert.equal(_isbn, isbn, "incorrect isbn");
    });
  });

  it("Should register price", function() {
    return book.price.call().then(function(_price) {
      assert.equal(_price, price, "incorrect price");
    });
  });

  it("Should register borrower", function(done) {
    var event = book.Borrowed()
    event.watch(function(err, result) {
      assert.equal(result.args.borrower, borrower, "incorrect borrower");
      event.stopWatching();
      done();
    });
    book.borrow({from: borrower});
  });

  it("Should register second borrower", function(done) {
    var event = book.Borrowed()
    event.watch(function(err, result) {
      assert.equal(result.args.borrower, borrower2, "incorrect borrower");
      event.stopWatching();
      done();
    });
    book.borrow({from: borrower2});
  });

  it("Should show all 'Borrowed' events and these should be correct", function(done) {
    var event = book.Borrowed({fromBlock: 0, toBlock: 'pending', event: 'Borrowed'});
    event.get(function(err, logs) {
      console.log(logs);
      assert.equal(logs.length, 2, "incorrect log length");
      assert.equal(logs[0].args.borrower, borrower, "incorrect borrower");
      assert.equal(logs[1].args.borrower, borrower2, "incorrect second borrower");
      done();
    });
  });

});
