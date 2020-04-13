var moment = require("moment");
var should = require("should");
var Misc = require("../lib/misc.js");


describe("test DOLLARDE", function() {

    it("", function() {
        Misc.DOLLARDE(1.02, 16).should.equal(1.125);
    });
    it("", function() {
        Misc.DOLLARDE(1.1, 32).should.equal(1.3125000000000002);
    });
});

describe("test DOLLARFR", function() {

    it("", function() {
        Misc.DOLLARFR(1.125, 16).should.equal(1.02);
    });
    it("", function() {
        Misc.DOLLARFR(1.125, 32).should.equal(1.04);
    });
});

describe("test EFFECT", function() {

    it("", function() {
        Misc.EFFECT(.0525, 4).should.equal(0.05354266737075841);
    });

});

describe("test NOMINAL", function() {

    it("", function() {
        Misc.NOMINAL(.053543, 4).should.equal(0.052500319868356016);
    });

});
