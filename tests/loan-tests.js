var moment = require("moment");
var should = require("should");
var Loan = require("../lib/loan.js");


describe("test IPMT", function() {

    var a2 = .1;
    var a3 = 1;
    var a4 = 3;
    var a5 = 8000;

    it("", function() {
        Loan.IPMT(a2/12, a3*3, a4, a5).should.equal(-22.406893015923927);
    });

    it("", function() {
        Loan.IPMT(a2, 3, a4, a5).should.equal(-292.4471299093658);
    });

});

describe("test PPMT", function() {

    it("", function() {

        var a2 = .1;
        var a3 = 2;
        var a4 = 2000;

        Loan.PPMT(a2/12, 1, a3*12, a4).should.equal(-75.62318600836672);
    });

    it("", function() {

        var a2 = .08;
        var a3 = 10;
        var a4 = 200000;

        Loan.PPMT(a2, a3, 10, a4).should.equal(-27598.053462421354);
    });

});

describe("test CUMIPMT", function() {

    var a2 = .09;
    var a3 = 30;
    var a4 = 125000;

    it("", function() {
        Loan.CUMIPMT(a2/12,a3*12,a4,13,24,0).should.equal(-11135.232130750845);
    });

    it("", function() {
        Loan.CUMIPMT(a2/12,a3*12,a4,1,1,0).should.equal(-937.5);
    });

});

describe("test CUMPRINC", function() {

    var a2 = .09;
    var a3 = 30;
    var a4 = 125000;

    it("", function() {
        Loan.CUMPRINC(a2/12,a3*12,a4,13,24,0).should.equal(-934.1071234208695);
    });
    it("", function() {
        Loan.CUMPRINC(a2/12,a3*12,a4,1,1,0).should.equal(-68.27827118097616);
    });
});

describe("test ISPMT", function() {

    var a2 = .1;
    var a3 = 1;
    var a4 = 3;
    var a5 = 8000000;

    it("", function() {
        Loan.ISPMT(a2/12,a3,a4*12,a5).should.equal(-64814.81481481482);
    });
    it("", function() {
        Loan.ISPMT(a2,1,a4,a5).should.equal(-533333.3333333333);
    });

});
