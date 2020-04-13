var moment = require("moment");
var should = require("should");
var Depreciation = require("../lib/depreciation.js");


describe("test DB", function() {

    var initial  = 1000000;
    var salvage  = 100000;
    var lifetime = 6;

    it("", function() {
        Depreciation.DB(initial, salvage, lifetime, 1, 7).should.equal(186083.33333333334);
    });

    it("", function() {
        Depreciation.DB(initial, salvage, lifetime, 2, 7).should.equal(259639.41666666666);
    });

    it("", function() {
        Depreciation.DB(initial, salvage, lifetime, 3, 7).should.equal(176814.44275000002);
    });

    it("", function() {
        Depreciation.DB(initial, salvage, lifetime, 4, 7).should.equal(120410.63551274998);
    });

    it("", function() {
        Depreciation.DB(initial, salvage, lifetime, 5, 7).should.equal(81999.64278418274);
    });

    it("", function() {
        Depreciation.DB(initial, salvage, lifetime, 6, 7).should.equal(55841.75673602846);
    });

    // period must be less than life?
    it("", function() {
        Depreciation.DB(initial, salvage, lifetime, 7, 7).should.equal(15845.098473848071);
    });
    // it("", function() {
    //     Depreciation.DB(initial, salvage, lifetime, 8, 7).should.equal(15845.10);
    // });

});

describe("test SLN", function() {

    it("", function() {
        Depreciation.SLN(30000, 7500, 10).should.equal(2250);
    });

});

describe("test SYD", function() {

    it("", function() {
        Depreciation.SYD(30000, 7500, 10, 1).should.equal(4090.909090909091);
    });

    it("", function() {
        Depreciation.SYD(30000, 7500, 10, 10).should.equal(409.09090909090907);
    });

});

describe("test DDB", function() {

    var a2 = 2400;
    var a3 = 300;
    var a4 = 10;

    it("", function() {
        Depreciation.DDB(a2,a3,a4*365,1).should.equal(1.3150684931506849);
    });

    it("", function() {
        Depreciation.DDB(a2,a3,a4*12,1,2).should.equal(40);
    });

    it("", function() {
        Depreciation.DDB(a2,a3,a4,1,2).should.equal(480);
    });

    it("", function() {
        Depreciation.DDB(a2,a3,a4,2,1.5).should.equal(306);
    });

    it("", function() {
        Depreciation.DDB(a2,a3,a4,10).should.equal(22.1225472000001);
    });
});

describe("test VDB", function() {

    var a2 = 2400;
    var a3 = 300;
    var a4 = 10;

    it("", function() {
        Depreciation.VDB(a2, a3, a4*365, 0, 1).should.equal(1.3150684931506849);
    });

    it("", function() {
        Depreciation.VDB(a2, a3, a4*12, 0, 1).should.equal(40);
    });

    it("", function() {
        Depreciation.VDB(a2, a3, a4, 0, 1).should.equal(480);
    });

    it("", function() {
        Depreciation.VDB(a2, a3, a4*12, 6, 18).should.equal(396.30605326475074);
    });

    it("", function() {
        Depreciation.VDB(a2, a3, a4*12, 6, 18, 1.5).should.equal(311.8089366582341);
    });

    it("", function() {
        Depreciation.VDB(a2, a3, a4, 0, 0.875, 1.5).should.equal(315);
    });
});

describe("test AMORLINC", function() {

    it("", function() {
        Depreciation.AMORLINC(2400, "8/19/2008", "12/31/2008", 300, 1, .15, 1).should.equal(360);
    });

});

describe("test AMORDEGRC", function() {

    it("", function() {
        Depreciation.AMORDEGRC(2400, "8/19/2008", "12/31/2008", 300, 1, .15, 1, false).should.equal(776.25);
    });

});