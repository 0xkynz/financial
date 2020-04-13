var should = require("should");
var common = require("../lib/common.js");

describe("test common", function() {

    // it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 0, false)", function() {
    //     Formulae.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 0, false).should.equal(183.88888888888889);
    // });

    it("should emulate F# map function.", function() {

        var f  = function(item) { return item + 5; };
        var l1 = [0,1,2,3,4];
        var r1 = [5,6,7,8,9];

        common.map(f, l1).should.eql(r1);
    });

    it("should emulate F# mapi function.", function() {

        var f  = function(index, item) { return item + index; };
        var l1 = [0,1,2,3,4];
        var r2 = [0,2,4,6,8];

        common.mapi(f, l1).should.eql(r2);
    });

    it("should emulate F# map2 function.", function() {

        var f  = function(item1, item2) { return item1 * item2; };
        var l1 = [0,1,2,3,4];
        var l2 = [0,2,4,6,8];
        var r3 = [0,2,8,18,32];

        common.map2(f, l1, l2).should.eql(r3);
    });

    // it("should emulate F# fold function.", function() {
    //     Common.fold().should.equal();
    // });

});