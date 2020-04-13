var should = require("should");
var Bonds = require("../lib/bonds.js");

describe("test ACCRINT", function() {

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 0, false)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 0, false).should.equal(183.88888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 0, false)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 0, false).should.equal(183.88888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 0, false)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 0, false).should.equal(183.88888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 2, false)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 2, false).should.equal(186.38888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 2, false)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 2, false).should.equal(186.38888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 2, false)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 2, false).should.equal(186.38888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 4, false)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 4, false).should.equal(183.88888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 4, false)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 4, false).should.equal(183.88888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 4, false)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 4, false).should.equal(183.88888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 0, true)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 0, true).should.equal(16.11111111111111);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 2, true)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 2, true).should.equal(15.833333333333332);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 0, false)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 0, false).should.equal(16.11111111111111);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 0, false)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 0, false).should.equal(-83.88888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 0, false)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 0, false).should.equal(-133.8888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 2, false)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 2, false).should.equal(15.833333333333332);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 2, false)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 2, false).should.equal(-85.55555555555556);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 4, false)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 4, false).should.equal(16.11111111111111);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 4, false)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 4, false).should.equal(-83.88888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 4, false)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 4, false).should.equal(-133.8888888888889);
    });

    it("should correctly calculate ACCRINT('Hello World!', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 0)", function() {
        Bonds.ACCRINT('Hello World!', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 0).should.equal("#VALUE!");
    });

    it("should correctly calculate ACCRINT('2/2/2012', 'Hello World!', '12/4/2013', 0.1, 1000, 2, 0)", function() {
        Bonds.ACCRINT('2/2/2012', 'Hello World!', '12/4/2013', 0.1, 1000, 2, 0).should.equal("#VALUE!");
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', 'Hello World!', 0.1, 1000, 2, 0)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', 'Hello World!', 0.1, 1000, 2, 0).should.equal("#VALUE!");
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0, 1000, 2, 0)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0, 1000, 2, 0).should.equal("#NUM!");
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', -0.1, 1000, 2, 0)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', -0.1, 1000, 2, 0).should.equal("#NUM!");
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 0, 2, 0)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 0, 2, 0).should.equal("#NUM!");
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, -1000, 2, 0)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, -1000, 2, 0).should.equal("#NUM!");
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 3, 0)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 3, 0).should.equal("#NUM!");
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 5)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 5).should.equal("#NUM!");
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 4, true)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 4, true).should.equal(16.11111111111111);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 0, true)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 0, true).should.equal(16.11111111111111);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 0, true)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 0, true).should.equal(16.11111111111111);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 4, true)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 4, true).should.equal(16.11111111111111);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 4, true)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 4, true).should.equal(16.11111111111111);
    });


    // //////////////////////////////////
    // // WRONG ... due to settlment > first interest

    // it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 1, true)", function() {
    //     Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 1, true).should.equal(183.60655737705);
    // });

    // it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 1, true)", function() {
    //     Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 1, true).should.equal(183.51648351648);
    // });

    // it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 1, true)", function() {
    //     Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 1, true).should.equal(183.51648351648);
    // });

    // it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 2, true)", function() {
    //     Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 2, true).should.equal(185);
    // });

    // it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 2, true)", function() {
    //     Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 2, true).should.equal(183.88888888888889);
    // });

    // it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 2, true)", function() {
    //     Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 2, true).should.equal(183.88888888888889);
    // });

    // it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 3, true)", function() {
    //     Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 3, true).should.equal(183.42465753425);
    // });

    // it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 3, true)", function() {
    //     Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 3, true).should.equal(183.42465753425);
    // });

    // it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 3, false)", function() {
    //     Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 3, false).should.equal(186.38888888888889);
    // });

    // it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 3, false)", function() {
    //     Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 3, false).should.equal(186.38888888888889);
    // });

    // it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 3, false)", function() {
    //     Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 3, false).should.equal(186.38888888888889);
    // });

    // it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 1, true)", function() {
    //     Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 1, true).should.equal(15.38737929486);
    // });

    // ///////////////


    // /////////////////////////////////////
    // // **********************************
    // // Correct but simply rounding errors

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 1, false)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 1, false).should.equal(184.34065934065933);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 1, false)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 1, false).should.equal(183.33333333333331);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 1, false)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 1, false).should.equal(184.34065934065933);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 1, true)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 1, true).should.equal(15.387379294857407);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 3, true)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 3, true).should.equal(15.616438356164386);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 1, false)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 1, false).should.equal(15.387379294857407);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 1, false)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 1, false).should.equal(-84.15300546448088);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 1, false)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 1, false).should.equal(-135.16483516483518);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 2, false)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 2, false).should.equal(-136.66666666666666);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 3, false)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 1, 3, false).should.equal(15.616438356164386);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 3, false)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 3, false).should.equal(-84.3835616438356);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 3, false)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 3, false).should.equal(-134.7945205479452);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 1, true)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 1, true).should.equal(14.835164835164836);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 2, true)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 2, true).should.equal(14.444444444444448);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 2, true)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 2, true).should.equal(13.33333333333334);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 3, true)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 2, 3, true).should.equal(15.616438356164391);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 0, true)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 0, true).should.equal(183.8888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 0, true)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 0, true).should.equal(183.8888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 0, true)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 0, true).should.equal(183.8888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 3, true)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 3, true).should.equal(183.83561643835614);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 4, true)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 1, 4, true).should.equal(183.8888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 4, true)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 2, 4, true).should.equal(183.8888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 4, true)", function() {
        Bonds.ACCRINT('2/2/2012', '3/30/2012', '12/4/2013', 0.1, 1000, 4, 4, true).should.equal(183.8888888888889);
    });

    it("should correctly calculate ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 3, true)", function() {
        Bonds.ACCRINT('2/2/2012', '12/4/2013', '3/30/2012', 0.1, 1000, 4, 3, true).should.equal(15.205479452054792);
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //

});

describe("test ACCRINTM", function() {

    it("", function() {
        Bonds.ACCRINTM("4/1/2008", "6/15/2008", .1, 1000, 3).should.equal(20.54794520547945);
    });

});

describe("test PRICE", function() {

    it("", function() {
        Bonds.PRICE("2/15/2008", "11/15/2017", .0575, .0650, 100, 2, 0).should.equal(94.63436162132213);
    });

});

describe("test PRICEMAT", function() {

    it("", function() {
        Bonds.PRICEMAT("2/15/2008", "4/13/2008", "11/11/2007", .061, .061, 0).should.equal(99.98449887555694);
    });

});

describe("test YIELDMAT", function() {

    it("", function() {
        Bonds.YIELDMAT("3/15/2008", "11/3/2008", "11/8/2007", .0625, 100.0123, 0).should.equal(0.06095433369153867);
    });

});

describe("test INTRATE", function() {

    it("", function() {
        Bonds.INTRATE("2/15/2008", "5/15/2008", 1000000, 1014420, 2).should.equal(0.05768);
    });

});

describe("test RECEIVED", function() {

    it("", function() {
        Bonds.RECEIVED("2/15/2008", "5/15/2008", 1000000, .0575, 2).should.equal(1014584.6544071021);
    });

});

describe("test DISC", function() {

    it("", function() {
        Bonds.DISC("1/25/2007", "6/15/2007", 97.975, 100, 1).should.equal(0.05242021276595771);
    });

});

describe("test PRICEDISC", function() {

    it("", function() {
        Bonds.PRICEDISC("2/16/2008", "3/1/2008", .0525, 100, 2).should.equal(99.79583333333333);
    });

});

describe("test YIELDDISC", function() {

    it("", function() {
        Bonds.YIELDDISC("2/16/2008", "3/1/2008", 99.795, 100, 2).should.equal(0.05282257198685834);
    });

});

describe("test DURATION", function() {

    it("", function() {
        Bonds.DURATION("1/1/2008", "1/1/2016", .08, .09, 2, 1).should.equal(5.993774955545186);
    });

});

describe("test MDURATION", function() {

    it("", function() {
        Bonds.MDURATION("1/1/2008", "1/1/2016", .08, .09, 2, 1).should.equal(5.735669813918839);
    });

});