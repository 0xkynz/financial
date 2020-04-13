var moment = require("moment");
var should = require("should");
var Irr = require("../lib/irr.js");


describe("test IRR", function() {

    var t1 = [-70000, 12000, 15000, 18000, 21000];
    var t2 = [-70000, 12000, 15000, 18000, 21000, 26000];
    var t3 = [-70000, 12000, 15000];

    it("", function() {
        Irr.IRR(t1).should.equal(-0.021244848273126928);
    });

    it("", function() {
        Irr.IRR(t2).should.equal(0.08663094803653171);
    });

    it("", function() {
        Irr.IRR(t3, -.1).should.equal(-0.44350694133450463);
    });

});

describe("test NPV", function() {

    var rate = .08;
    var initial = -40000;
    var a4 = 8000;
    var a5 = 9200;
    var a6 = 10000;
    var a7 = 12000;
    var a8 = 14500;

    it("", function() {
        Irr.NPV(.1, [-10000, 3000, 4200, 6800]).should.equal(1188.4434123352216);
    });

    it("", function() {
        Irr.NPV(rate, [a4,a5,a6,a7,a8]).should.equal(41922.06155493236);
    });

    it("", function() {
        Irr.NPV(rate, [a4,a5,a6,a7,a8,-9000]).should.equal(36250.534912984425);
    });

});

describe("test MIRR", function() {

    var a2 = -120000;
    var a3 = 39000;
    var a4 = 30000;
    var a5 = 21000;
    var a6 = 37000;
    var a7 = 46000;
    var a8 = .1;
    var a9 = .12;

    it("", function() {
        Irr.MIRR([a2,a3,a4,a5,a6,a7], a8, a9).should.equal(0.1260941303659051);
    });

    it("", function() {
        Irr.MIRR([a2,a3,a4,a5], a8, a9).should.equal(-0.048044655249980806);
    });

    it("", function() {
        Irr.MIRR([a2,a3,a4,a5,a6,a7], a8, .14).should.equal(0.13475911082831482);
    });

});

describe("test XNPV", function() {

    it("", function() {
        Irr.XNPV(.09, [-10000, 2750, 4250, 3250, 2750], ["1/1/2008", "3/1/2008", "10/30/2008", "2/15/2009", "4/1/2009"]).should.equal(2086.647602031535);
    });

});

describe("test XIRR", function() {

    it("", function() {
        Irr.XIRR([-10000, 2750, 4250, 3250, 2750], ["1/1/2008", "3/1/2008", "10/30/2008", "2/15/2009", "4/1/2009"], .1).should.equal(0.3733625335188316);
    });

});
