
(function (definition) {
    if (typeof exports === "object") {
        var Common        = require("./lib/common.js");
        var DayCountBasis = require("./lib/daycountbasis.js");
        var Bonds         = require("./lib/bonds.js");
        var Depreciation  = require("./lib/depreciation.js");
        var Irr           = require("./lib/irr.js");
        var Loan          = require("./lib/loan.js");
        var Misc          = require("./lib/misc.js");
        var TBill         = require("./lib/tbill.js");
        var Tvm           = require("./lib/tvm.js");
        var OddBonds      = require("./lib/oddbonds.js");

      module.exports = definition(Common, DayCountBasis, Bonds, Depreciation, Irr, Loan, Misc, TBill, Tvm, OddBonds);
    } else if (typeof define === "function" && define.amd) {

        requirejs.config({
            baseUrl: 'lib'
        });

        define(['common', 'daycountbasis', 'bonds', 'depreciation',
                'irr', 'loan', 'misc', 'tbill', 'tvm',
                'oddbonds'], definition);
    }
})( function(Common, DayCountBasis, Bonds, Depreciation, Irr, Loan, Misc, TBill, Tvm, OddBonds) {

    var scope = this.Financial = {};

    /* DAYCOUNTBASIS */

    scope.COUPDAYS = function(settlement, maturity, frequency, basis) {
        return DayCountBasis.COUPDAYS(settlement, maturity, frequency, basis);
    };

    scope.COUPPCD = function(settlement, maturity, frequency, basis) {
        return DayCountBasis.COUPPCD(settlement, maturity, frequency, basis);
    };

    scope.COUPNCD = function(settlement, maturity, frequency, basis) {
        return DayCountBasis.COUPNCD(settlement, maturity, frequency, basis);
    };

    scope.COUPNUM = function(settlement, maturity, frequency, basis) {
        return DayCountBasis.COUPNUM(settlement, maturity, frequency, basis);
    };

    scope.COUPDAYBS = function(settlement, maturity, frequency, basis) {
        return DayCountBasis.COUPDAYBS(settlement, maturity, frequency, basis);
    };

    scope.COUPDAYSNC = function(settlement, maturity, frequency, basis) {
        return DayCountBasis.COUPDAYSNC(settlement, maturity, frequency, basis);
    };

    scope.YEARFRAC = function(startDate, endDate, basis) {
        return DayCountBasis.YEARFRAC(startDate, endDate, basis);
    };


    /* BONDS */

    scope.ACCRINT = function(issue, first, settlement, rate, par, frequency, basis, method) {
        return Bonds.ACCRINT(issue, first, settlement, rate, par, frequency, basis, method);
    };

    scope.ACCRINTM = function(issue, settlement, rate, par, basis) {
        return Bonds.ACCRINTM(issue, settlement, rate, par, basis);
    };

    scope.PRICE = function(settlement, maturity, rate, yld, redemption, frequency, basis) {
        return Bonds.PRICE(settlement, maturity, rate, yld, redemption, frequency, basis);
    };

    scope.PRICEMAT = function(settlement, maturity, issue, rate, yld, basis) {
        return Bonds.PRICEMAT(settlement, maturity, issue, rate, yld, basis);
    };

    scope.YIELDMAT = function(settlement, maturity, issue, rate, pr, basis) {
        return Bonds.YIELDMAT(settlement, maturity, issue, rate, pr, basis);
    };

    scope.INTRATE = function(settlement, maturity, investment, redemption, basis) {
        return Bonds.INTRATE(settlement, maturity, investment, redemption, basis);
    };

    scope.RECEIVED = function(settlement, maturity, investment, discount, basis) {
        return Bonds.RECEIVED(settlement, maturity, investment, discount, basis);
    };

    scope.DISC = function(settlement, maturity, pr, redemption, basis) {
        return Bonds.DISC(settlement, maturity, pr, redemption, basis);
    };

    scope.PRICEDISC = function(settlement, maturity, discount, redemption, basis) {
        return Bonds.PRICEDISC(settlement, maturity, discount, redemption, basis);
    };

    scope.YIELDDISC = function(settlement, maturity, pr, redemption, basis) {
        return Bonds.YIELDDISC(settlement, maturity, pr, redemption, basis);
    };

    scope.DURATION = function(settlement, maturity, coupon, yld, frequency, basis) {
        return Bonds.DURATION(settlement, maturity, coupon, yld, frequency, basis);
    };

    scope.MDURATION = function(settlement, maturity, coupon, yld, frequency, basis) {
        return Bonds.MDURATION(settlement, maturity, coupon, yld, frequency, basis);
    };


    /* DEPRECIATION */

    scope.DB = function(cost, salvage, life, period, month) {
        return Depreciation.DB(cost, salvage, life, period, month);
    };

    scope.SLN = function(cost, salvage, life) {
        return Depreciation.SLN(cost, salvage, life);
    };

    scope.SYD = function(cost, salvage, life, per) {
        return Depreciation.SYD(cost, salvage, life, per);
    };

    scope.DDB = function(cost, salvage, life, period, factor) {
        return Depreciation.DDB(cost, salvage, life, period, factor);
    };

    scope.VDB = function(cost, salvage, life, startPeriod, endPeriod, factor, bflag) {
        return Depreciation.VDB(cost, salvage, life, startPeriod, endPeriod, factor, bflag);
    };

    scope.AMORLINC = function(cost, datePurchased, firstPeriod, salvage, period, rate, basis) {
        return Depreciation.AMORLINC(cost, datePurchased, firstPeriod, salvage, period, rate, basis);
    };

    scope.AMORDEGRC = function(cost, datePurchased, firstPeriod, salvage, period, rate, basis, excelComplaint) {
        return Depreciation.AMORDEGRC(cost, datePurchased, firstPeriod, salvage, period, rate, basis, excelComplaint);
    };


    /* IRR */

    scope.IRR = function(cfs, guess) {
        return Irr.IRR(cfs, guess);
    };

    scope.NPV = function(r, cfs) {
        return Irr.NPV(r, cfs);
    };

    scope.MIRR = function(cfs, financeRate, reinvestRate) {
        return Irr.MIRR(cfs, financeRate, reinvestRate);
    };

    scope.XNPV = function(r, cfs, dates) {
        return Irr.XNPV(r, cfs, dates);
    };

    scope.XIRR = function(cfs, dates, guess) {
        return Irr.XIRR(cfs, dates, guess);
    };


    /* LOAN */

    scope.IPMT = function(r, per, nper, pv, fv, pd) {
        return Loan.IPMT(r, per, nper, pv, fv, pd);
    };

    scope.PPMT = function(r, per, nper, pv, fv, pd) {
        return Loan.PPMT(r, per, nper, pv, fv, pd);
    };

    scope.CUMIPMT = function(r, nper, pv, startPeriod, endPeriod, pd) {
        return Loan.CUMIPMT(r, nper, pv, startPeriod, endPeriod, pd);
    };

    scope.CUMPRINC = function(r, nper, pv, startPeriod, endPeriod, pd) {
        return Loan.CUMPRINC(r, nper, pv, startPeriod, endPeriod, pd);
    };

    scope.ISPMT = function(r, per, nper, pv) {
        return Loan.ISPMT(r, per, nper, pv);
    };


    /* MISC */

    scope.DOLLARDE = function(fractionalDollar, fraction) {
        return Misc.DOLLARDE(fractionalDollar, fraction);
    };

    scope.DOLLARFR = function(fractionalDollar, fraction) {
        return Misc.DOLLARFR(fractionalDollar, fraction);
    };

    scope.EFFECT = function(nominalRate, npery) {
        return Misc.EFFECT(nominalRate, npery);
    };

    scope.NOMINAL = function(effectRate, npery) {
        return Misc.NOMINAL(effectRate, npery);
    };


    /* TBILL */

    scope.TBILLEQ = function(settlement, maturity, discount) {
        return TBill.TBILLEQ(settlement, maturity, discount);
    };

    scope.TBILLYIELD = function(settlement, maturity, pr) {
        return TBill.TBILLYIELD(settlement, maturity, pr);
    };

    scope.TBILLPRICE = function(settlement, maturity, discount) {
        return TBill.TBILLPRICE(settlement, maturity, discount);
    };


    /* TVM */

    scope.PV = function(r, nper, pmt, fv, pd) {
        return Tvm.PV(r, nper, pmt, fv, pd);
    };

    scope.FV = function(r, nper, pmt, pv, pd) {
        return Tvm.FV(r, nper, pmt, pv, pd);
    };

    scope.PMT = function(r, nper, pv, fv, pd) {
        return Tvm.PMT(r, nper, pv, fv, pd);
    };

    scope.NPER = function(r, pmt, pv, fv, pd) {
        return Tvm.NPER(r, pmt, pv, fv, pd);
    };

    scope.RATE = function(nper, pmt, pv, fv, pd, guess) {
        return Tvm.RATE(nper, pmt, pv, fv, pd, guess);
    };

    scope.FVSCHEDULE = function(pv, interests) {
        return Tvm.FVSCHEDULE(pv, interests);
    };


    /* ODDBONDS */

    scope.ODDFPRICE = function(settlement, maturity, issue, firstCoupon, rate, yld, redemption, frequency, basis) {
        return OddBonds.ODDFPRICE(settlement, maturity, issue, firstCoupon, rate, yld, redemption, frequency, basis);
    };

    scope.ODDFYIELD = function(settlement, maturity, issue, firstCoupon, rate, pr, redemption, frequency, basis) {
        return OddBonds.ODDFYIELD(settlement, maturity, issue, firstCoupon, rate, pr, redemption, frequency, basis);
    };

    scope.ODDLPRICE = function(settlement, maturity, lastInterest, rate, yld, redemption, frequency, basis) {
        return OddBonds.ODDLPRICE(settlement, maturity, lastInterest, rate, yld, redemption, frequency, basis);
    };

    scope.ODDLYIELD = function(settlement, maturity, lastInterest, rate, pr, redemption, frequency, basis) {
        return OddBonds.ODDLYIELD(settlement, maturity, lastInterest, rate, pr, redemption, frequency, basis);
    };


    return scope;

});
