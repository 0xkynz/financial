var moment = require("moment");
var should = require("should");
var Tvm = require("../lib/tvm.js");


describe("test PV", function() {

    it("", function() {
        Tvm.PV(.08/12, 12*20, 500, null, 0).should.equal(-59777.145851187815);
    });

});

describe("test FV", function() {

    it("", function() {
        Tvm.FV(.06/12, 10, -200, -500, 1).should.equal(2581.40337406012);
    });

    it("", function() {
        Tvm.FV(.12/12, 12, -1000, null, null).should.equal(12682.503013196972);
    });

    it("", function() {
        Tvm.FV(.11/12, 35, -2000, null, 1).should.equal(82846.24637190055);
    });

    it("", function() {
        Tvm.FV(.06/12, 12, -100, -1000, 1).should.equal(2301.401830340899);
    });

});

describe("test PMT", function() {

    var a2 = .08;
    var a3 = 10;
    var a4 = 10000;

    it("", function() {
        Tvm.PMT(a2/12, a3, a4).should.equal(-1037.0320893591606);
    });
    it("", function() {
        Tvm.PMT(a2/12, a3, a4, 0, 1).should.equal(-1030.1643271779744);
    });

    it("", function() {
        Tvm.PMT(.06/12, 18*12, 0, 50000).should.equal(-129.08116086799728);
    });

});

describe("test NPER", function() {

    var a2 = .12;
    var a3 = -100;
    var a4 = -1000;
    var a5 = 10000;

    it("", function() {
        Tvm.NPER(a2/12, a3, a4, a5, 1).should.equal(59.67386567429457);
    });
    it("", function() {
        Tvm.NPER(a2/12, a3, a4, a5).should.equal(60.08212285376166);
    });
    it("", function() {
        Tvm.NPER(a2/12, a3, a4).should.equal(-9.578594039813161);
    });
});

describe("test RATE", function() {

    it("", function() {
        Tvm.RATE(4*12, -200, 8000).should.equal(0.0077014724882337356);
    });

});

describe("test FVSCHEDULE", function() {

    it("", function() {
        Tvm.FVSCHEDULE(1, [.09, .11, .1]).should.equal(1.3308900000000004);
    });

});