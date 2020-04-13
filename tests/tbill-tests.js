var moment = require("moment");
var should = require("should");
var TBill = require("../lib/tbill.js");


describe("test TBILLEQ", function() {

    it("", function() {
        TBill.TBILLEQ("3/31/2008", "6/1/2008", .0914).should.equal(0.09415149356594302);
    });

});

describe("test TBILLYIELD", function() {

    it("", function() {
        TBill.TBILLYIELD("3/31/2008", "6/1/2008", 98.45).should.equal(0.09141696292534264);
    });

});

describe("test TBILLPRICE", function() {

    it("", function() {
        TBill.TBILLPRICE("3/31/2008", "6/1/2008", .09).should.equal(98.45);
    });

});