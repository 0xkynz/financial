var moment   = require("moment");
var should   = require("should");
var OddBonds = require("../lib/oddbonds.js");


describe("test ODDFPRICE", function() {

    it("", function() {

        var settlement    = "11/11/2008";
        var maturity      = "3/1/2021";
        var issue         = "10/15/2008";
        var firstCoupon   = "3/1/2009";
        var percentCoupon = .0785;
        var percentYld    = .0625;
        var redemption    = 100;
        var frequency     = 2;
        var basis         = 1;

        var answer        = 113.59771747407883;

        OddBonds.ODDFPRICE(settlement, maturity, issue, firstCoupon, percentCoupon, percentYld, redemption, frequency, basis).should.equal(answer);
    });

});

describe("test ODDFYIELD", function() {

    it("", function() {

        var settlement    = "11/11/2008";
        var maturity      = "3/1/2021";
        var issue         = "10/15/2008";
        var firstCoupon   = "3/1/2009";
        var percentCoupon = .0575;
        var price         = 84.5;
        var redemption    = 100;
        var frequency     = 2;
        var basis         = 0;

        var answer        = 0.07724554159781721;

        OddBonds.ODDFYIELD(settlement, maturity, issue, firstCoupon, percentCoupon, price, redemption, frequency, basis).should.equal(answer);
    });

});

describe("test ODDLPRICE", function() {

    it("", function() {

        var settlement    = "2/7/2008";
        var maturity      = "6/15/2008";
        var lastInterest  = "10/15/2007";
        var percentCoupon = .0375;
        var percentYld    = .0405;
        var redemption    = 100;
        var frequency     = 2;
        var basis         = 0;

        var answer        = 99.87828601472134;

        OddBonds.ODDLPRICE(settlement, maturity, lastInterest, percentCoupon, percentYld, redemption, frequency, basis).should.equal(answer);
    });

});

describe("test ODDLYIELD", function() {

    it("", function() {

        var settlement    = "4/20/2008";
        var maturity      = "6/15/2008";
        var lastInterest  = "12/24/2007";
        var percentCoupon = .0375;
        var price         = 99.875;
        var redemption    = 100;
        var frequency     = 2;
        var basis         = 0;

        var answer = 0.04519223562916916;

        OddBonds.ODDLYIELD(settlement, maturity, lastInterest, percentCoupon, price, redemption, frequency, basis).should.equal(answer);
    });

});