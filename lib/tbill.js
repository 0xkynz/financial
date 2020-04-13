(function (definition) {
    if (typeof exports === "object") {
        var moment        = require("moment");
        var Common        = require("../lib/common.js");
        var DayCountBasis = require("../lib/daycountbasis.js");

        module.exports = definition(moment, Common, DayCountBasis);
    } else if (typeof define === "function" && define.amd) {
        define(['moment', 'common', 'daycountbasis'], definition);
    }
})( function(moment, Common, DayCountBasis) {

    var scope = this.TBill = {};

    var getDsm = function(settlement, maturity, basis) {
        var dc = DayCount.dayCount(basis);
        return dc.DaysBetween(settlement, maturity, DayCount.NumDenumPosition.Numerator);
    };

    var TBillEq = function(settlement, maturity, discount) {
        var dsm = getDsm(settlement, maturity, DayCount.DayCountBasis.Actual360);
        if (dsm > 182) {
            var price     = (100 - discount * 100 * dsm / 360) / 100;
            var days      = (dsm === 366) ? 366 : 365;
            var tempTerm2 = Math.pow(dsm / days, 2) - (2 * dsm / days - 1) * (1 - 1 / price);
            var term2     = Math.sqrt(tempTerm2);
            var term3     = 2 * dsm / days - 1;

            return 2 * (term2 - dsm / days) / term3;
        } else {
            // This is from the docs, but it is valid just above 182 ...
            return 365 * discount / (360 - discount * dsm);
        }
    };

    var TBillYield = function(settlement, maturity, pr) {
        var dsm = getDsm(settlement, maturity, DayCount.DayCountBasis.ActualActual);
        return (100 - pr) / pr * 360 / dsm;
    };

    var TBillPrice = function(settlement, maturity, discount) {
        var dsm = getDsm(settlement, maturity, DayCount.DayCountBasis.ActualActual);
        return 100 * (1 - discount * dsm / 360);
    };

    scope.TBILLEQ = function(settlement, maturity, discount) {
        // let dsm = getDsm settlement maturity DayCountBasis.Actual360
        // let price = (100. - discount * 100. * dsm / 360.) / 100.
        // let days = if dsm = 366. then 366. else 365.
        // let tempTerm2 = (pow (dsm / days) 2.) - (2. * dsm / days - 1.) * (1. - 1. / price)
        // (tempTerm2 >= 0.)                       |> elseThrow "(dsm / days)^2 - (2. * dsm / days - 1.) * (1. - 1. / (100. - discount * 100. * dsm / 360.) / 100.) must be positive"
        // (2. * dsm / days - 1. <> 0.)            |> elseThrow "2. * dsm / days - 1. must be different from 0"

        // Check argument types
        if (typeof discount !== "number") {
            return '#VALUE!';
        }

        // Check for valid dates
        if (!moment(settlement).isValid() || !moment(maturity).isValid()) {
            return '#VALUE!';
        }

        if (discount <= 0) {
            return '#NUM!';
        }

        settlement = moment(settlement);
        maturity   = moment(maturity);

        if (settlement.isAfter(maturity) || (maturity.isAfter(settlement) && (maturity.diff(settlement, 'years', true) > 1))) {
            return '#NUM!';
        }

        return TBillEq(settlement, maturity, discount);
    };

    scope.TBILLYIELD = function(settlement, maturity, pr) {
        // Check argument types
        if (typeof pr !== "number") {
            return '#VALUE!';
        }

        // Check for valid dates
        if (!moment(settlement).isValid() || !moment(maturity).isValid()) {
            return '#VALUE!';
        }

        if (pr <= 0) {
            return '#NUM!';
        }

        settlement = moment(settlement);
        maturity   = moment(maturity);

        if (settlement.isAfter(maturity) || (maturity.isAfter(settlement) && (maturity.diff(settlement, 'years', true) > 1))) {
            return '#NUM!';
        }

        return TBillYield(settlement, maturity, pr);
    };

    scope.TBILLPRICE = function(settlement, maturity, discount) {
        // let dsm = getDsm settlement maturity DayCountBasis.ActualActual
        // (100. * (1. - discount * dsm / 360.)) > 0. |> elseThrow "a result less than zero triggers an exception"

        // Check argument types
        if (typeof discount !== "number") {
            return '#VALUE!';
        }

        // Check for valid dates
        if (!moment(settlement).isValid() || !moment(maturity).isValid()) {
            return '#VALUE!';
        }

        if (discount <= 0) {
            return '#NUM!';
        }

        settlement = moment(settlement);
        maturity   = moment(maturity);

        if (settlement.isAfter(maturity) || (maturity.isAfter(settlement) && (maturity.diff(settlement, 'years', true) > 1))) {
            return '#NUM!';
        }

        return TBillPrice(settlement, maturity, discount);
    };

    return scope;

});