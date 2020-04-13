var moment = require("moment");
var should = require("should");
var DayCountBasis = require("../lib/daycountbasis.js");


describe("test COUPDAYS", function() {

    it("", function() {
        DayCountBasis.COUPDAYS('1/25/2007', '11/15/2008', 2, 1).should.equal(181);
    });

});

describe("test COUPPCD", function() {

    it("", function() {
        DayCountBasis.COUPPCD('1/25/2007', '11/15/2008', 2, 1).format().should.equal(moment("11/15/2006").format());
    });

});

describe("test COUPNCD", function() {

    it("", function() {
        DayCountBasis.COUPNCD('1/25/2007', '11/15/2008', 2, 1).format().should.equal(moment("5/15/2007").format());
    });

});

describe("test COUPNUM", function() {

    it("", function() {
        DayCountBasis.COUPNUM('1/25/2007', '11/15/2008', 2, 1).should.equal(4);
    });

});

describe("test COUPDAYBS", function() {

    it("", function() {
        DayCountBasis.COUPDAYBS('1/25/2007', '11/15/2008', 2, 1).should.equal(71);
    });

});

describe("test COUPDAYSNC", function() {

    it("", function() {
        DayCountBasis.COUPDAYSNC('1/25/2007', '11/15/2008', 2, 1).should.equal(110);
    });

});

describe("test YEARFRAC", function() {

    it("", function() {
        DayCountBasis.YEARFRAC('1/1/2007', '7/30/2007', 2).should.equal(0.5833333333333334);
    });

});
