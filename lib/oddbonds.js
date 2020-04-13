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

    var scope = this.OddBonds = {};

    var coupNumber = function(mat, settl, numMonths, basis, isWholeNumber) {

        var my = mat.year(),   mm = mat.month(),   md = mat.date();
        var sy = settl.year(), sm = settl.month(), sd = settl.date();

        var couponsTemp    = (isWholeNumber == true ? 0 : 1 );
        var endOfMonthTemp = Common.isLastDayOfMonth(mat);
        var endOfMonth     = ((endOfMonthTemp === false) && (mm != 2) && (md > 28) && (md < mat.daysInMonth())
            ? Common.isLastDayOfMonth(settl) : endOfMonthTemp);

        var startDate = DayCountBasis.changeMonth(settl, 0, basis, endOfMonth);
        var coupons   = (startDate.isAfter(settl) ? couponsTemp + 1 : couponsTemp);
        var date      = DayCountBasis.changeMonth(startDate, numMonths, basis, endOfMonth);

        var f = function(pcd, ncd) {
            return 1;
        };

        var result = DayCountBasis.datesAggregate1(date, mat, numMonths, basis, f, coupons, endOfMonth)[2];

        return result;
    };

    var daysBetweenNotNeg = function(dc, startDate, endDate) {

        var result = dc.DaysBetween(startDate, endDate, DayCountBasis.NumDenumPosition.Numerator);

        if (result > 0) {
            return result;
        } else {
            return 0;
        }
    };

    var daysBetweenNotNegPsaHack = function(startDate, endDate) {
        var result = DayCountBasis.dateDiff360Us(startDate, endDate, DayCountBasis.Method360Us.ModifyBothDates);

        if (result > 0) {
            return result;
        } else {
            return 0;
        }
    };

    var daysBetweenNotNegWithHack = function(dc, startDate, endDate, basis) {

        if (basis === DayCountBasis.UsPsa30_360) {
            return daysBetweenNotNegPsaHack(startDate, endDate);
        } else {
            return daysBetweenNotNeg(dc, startDate, endDate);
        }
    };

    var oddFPrice = function(settlement, maturity, issue, firstCoupon, rate, yld, redemption, frequency, basis) {

        var my = maturity.year(), mm = maturity.month(), md = maturity.date();

        var dc           = DayCountBasis.dayCount(basis);
        var endMonth     = Common.isLastDayOfMonth(maturity);
        var numMonths    = DayCountBasis.freq2months(frequency);
        var numMonthsNeg = -numMonths;

        var e   = dc.CoupDays(settlement, firstCoupon, frequency);
        var n   = dc.CoupNum(settlement, maturity, frequency);
        var m   = frequency;
        var dfc = daysBetweenNotNeg(dc, issue, firstCoupon);

        if (dfc < e) {

            var dsc   = daysBetweenNotNeg(dc, settlement, firstCoupon);
            var a     = daysBetweenNotNeg(dc, issue, settlement);
            var x     = yld / m + 1;
            var y     = dsc / e;
            var p1    = x;
            var p3    = Math.pow(p1, n - 1 + y);
            var term1 = redemption / p3;
            var term2 = 100 * rate / m * dfc / e / Math.pow(p1, y);

            var f = function(acc, index) {
                return acc + 100 * rate / m / Math.pow(p1, index - 1 + y);
            };

            var term3 = Common.aggrBetween(2, Math.floor(n), f, 0);
            var p2    = rate / m;
            var term4 = a / e * p2 * 100;

            return term1 + term2 + term3 - term4;

        } else {

            var nc         = dc.CoupNum(issue, firstCoupon, frequency);
            var lateCoupon = firstCoupon;

            var aggrFunction = function(acc, index) {
                var earlyCoupon = DayCountBasis.changeMonth(lateCoupon, numMonthsNeg, basis, false);
                var nl          = (basis === DayCountBasis.ActualActual ? daysBetweenNotNeg(dc, earlyCoupon, lateCoupon) : e);

                var dci       = (index > 1 ? nl : daysBetweenNotNeg(dc, issue, lateCoupon));
                var startDate = (issue > earlyCoupon ? issue : earlyCoupon);
                var endDate   = (settlement < lateCoupon ? settlement : lateCoupon);

                var a      = daysBetweenNotNeg(dc, startDate, endDate);
                lateCoupon = earlyCoupon;
                var dcnl   = acc[0], anl = acc[1];

                return [dcnl + dci / nl, anl + a / nl];
            };

            var ag   = Common.aggrBetween( Math.floor(nc), 1, aggrFunction, [0,0] );
            var dcnl = ag[0], anl = ag[1];

            var dsc = 0;
            if (basis === DayCountBasis.Actual360 || basis === DayCountBasis.Actual365) {
                var d = dc.CoupNCD(settlement, firstCoupon, frequency);
                dsc   = daysBetweenNotNeg(dc, settlement, d);
            } else {
                var d = dc.CoupPCD(settlement, firstCoupon, frequency);
                var a = dc.DaysBetween(d, settlement, NumDenumPosition.Numerator);
                dsc   = e - a;
            }

            var nq    = coupNumber(firstCoupon, settlement, numMonths, basis, true);
            var n     = dc.CoupNum(firstCoupon, maturity, frequency);
            var x     = yld / m + 1;
            var y     = dsc / e;
            var p1    = x;
            var p3    = Math.pow(p1, y + nq + n);
            var term1 = redemption / p3;
            var term2 = 100 * rate / m * dcnl / Math.pow(p1, nq + y);

            var f = function(acc, index) {
                return acc + 100 * rate / m / Math.pow(p1, index + nq + y);
            };

            var term3 = Common.aggrBetween(1, Math.floor(n), f, 0);
            var term4 = 100 * rate / m * anl;

            return term1 + term2 + term3 - term4;
        }
    };

    var oddFYield = function(settlement, maturity, issue, firstCoupon, rate, pr, redemption, frequency, basis) {
        var dc    = DayCountBasis.dayCount(basis);
        var years = dc.DaysBetween(settlement, maturity, DayCountBasis.NumDenumPosition.Numerator);
        var m     = frequency;
        var px    = pr - 100;
        var num   = rate * years * 100 - px;
        var denum = px / 4 + years * px / 2 + years * 100;
        var guess = num / denum;

        var f = function(yld) {
            return pr - oddFPrice(settlement, maturity, issue, firstCoupon, rate, yld, redemption, frequency, basis);
        };

        return Common.findRoot(f, guess)
    };

    var oddLFunc = function(settlement, maturity, lastInterest, rate, prOrYld, redemption, frequency, basis, isLPrice) {
        var dc          = DayCountBasis.dayCount(basis);
        var m           = frequency;
        var numMonths   = Math.floor(12 / frequency);       // parseInt
        var lastCoupon  = lastInterest;
        var nc          = dc.CoupNum(lastCoupon, maturity, frequency);
        var earlyCoupon = lastCoupon;

        var aggrFunction  = function(acc, index) {
            var lateCoupon = DayCountBasis.changeMonth(earlyCoupon, numMonths, basis, false);
            var nl         = daysBetweenNotNegWithHack(dc, earlyCoupon, lateCoupon, basis);
            var dci        = (index < nc ? nl : daysBetweenNotNegWithHack(dc, earlyCoupon, maturity, basis));

            var a = 0;
            if (lateCoupon < settlement) {
                a = dci;
            } else if (earlyCoupon < settlement) {
                a = daysBetweenNotNeg(dc, earlyCoupon, settlement);
            }

            var startDate = (settlement > earlyCoupon ? settlement : earlyCoupon);
            var endDate   =  (maturity < lateCoupon ? maturity : lateCoupon);
            var dsc       = daysBetweenNotNeg(dc, startDate, endDate);
            earlyCoupon   = lateCoupon;

            var dcnl  = acc[0];
            var anl   = acc[1];
            var dscnl = acc[2];

            return [dcnl + dci / nl, anl + a / nl , dscnl + dsc / nl];
        };

        var agr   = Common.aggrBetween(1, Math.floor(nc), aggrFunction, [0, 0, 0]);
        var dcnl  = agr[0];
        var anl   = agr[1];
        var dscnl = agr[2];

        var x     = 100 * rate / m;
        var term1 = dcnl * x + redemption;

        if (isLPrice) {
            var term2 = dscnl * prOrYld / m + 1;
            var term3 = anl * x;

            return term1 / term2 - term3;
        } else {
            var term2 = anl * x + prOrYld;
            var term3 = m / dscnl;

            return (term1 - term2) / term2 * term3;
        }
    };


    scope.ODDFPRICE = function(settlement, maturity, issue, firstCoupon, rate, yld, redemption, frequency, basis) {
        // Check for valid dates
        if (!moment(settlement).isValid() || !moment(maturity).isValid() || !moment(issue).isValid() || !moment(firstCoupon).isValid()) {
            return '#VALUE!';
        }

        settlement  = moment(settlement);
        maturity    = moment(maturity);
        issue       = moment(issue);
        firstCoupon = moment(firstCoupon);

        var endMonth     = Common.isLastDayOfMonth(maturity);
        var numMonths    = Math.floor(12 / Math.floor(frequency));
        var numMonthsNeg = -numMonths;

        var r   = DayCountBasis.findPcdNcd(DayCountBasis.changeMonth(maturity, numMonthsNeg, basis, endMonth), firstCoupon, numMonthsNeg, basis, endMonth);
        var pcd = r[0];
        var ncd = r[1];

        // The next condition is not in the docs, but nevertheless is needed !!!!!
        // (pcd = firstCoupon)             |> elseThrow "maturity and firstCoupon must have the same month and day (except for February when leap years are considered)"
        if (!pcd.isSame(firstCoupon)) {
            return '#NUM!'; // ???
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // (rate >= 0.)                    |> elseThrow "rate must be more than 0"
        if (rate < 0) {
            return '#NUM!';
        }

        // (yld >= 0.)                     |> elseThrow "yld must be more than 0"
        if (yld < 0) {
            return '#NUM!';
        }

        // (redemption >= 0.)              |> elseThrow "redemption must be more than 0"
        if (redemption < 0) {
            return '#NUM!';
        }

        // (maturity > firstCoupon)        |> elseThrow "maturity must be after firstCoupon"
        if (!maturity.isAfter(firstCoupon)) {
            return '#NUM!';
        }

        // (firstCoupon > settlement)      |> elseThrow "firstCoupon must be after settlement"
        if (!firstCoupon.isAfter(settlement)) {
            return '#NUM!';
        }

        //(settlement > issue)            |> elseThrow "settlement must be after issue"
        if (!settlement.isAfter(issue)) {
            return '#NUM!';
        }

        return oddFPrice(settlement, maturity, issue, firstCoupon, rate, yld, redemption, Math.floor(frequency), basis);
    };

    scope.ODDFYIELD = function(settlement, maturity, issue, firstCoupon, rate, pr, redemption, frequency, basis) {
        // Check for valid dates
        if (!moment(settlement).isValid() || !moment(maturity).isValid() || !moment(issue).isValid() || !moment(firstCoupon).isValid()) {
            return '#VALUE!';
        }

        settlement  = moment(settlement);
        maturity    = moment(maturity);
        issue       = moment(issue);
        firstCoupon = moment(firstCoupon);

        if (rate < 0 || pr <= 0) {
            return '#NUM!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        if (redemption < 0) {
            return '#NUM!';
        }

        // (maturity > firstCoupon)        |> elseThrow "maturity must be after firstCoupon"
        if (!maturity.isAfter(firstCoupon)) {
            return '#NUM!';
        }

        // (firstCoupon > settlement)      |> elseThrow "firstCoupon must be after settlement"
        if (!firstCoupon.isAfter(settlement)) {
            return '#NUM!';
        }

        //(settlement > issue)            |> elseThrow "settlement must be after issue"
        if (!settlement.isAfter(issue)) {
            return '#NUM!';
        }

        return oddFYield(settlement, maturity, issue, firstCoupon, rate, pr, redemption, Math.floor(frequency), basis);
    };

    scope.ODDLPRICE = function(settlement, maturity, lastInterest, rate, yld, redemption, frequency, basis) {
        // Check for valid dates
        if (!moment(settlement).isValid() || !moment(maturity).isValid() || !moment(lastInterest).isValid()) {
            return '#VALUE!';
        }

        settlement   = moment(settlement);
        maturity     = moment(maturity);
        lastInterest = moment(lastInterest);

        if (rate < 0 || yld < 0 || redemption < 0) {
            return '#NUM!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        if (!maturity.isAfter(settlement)) {
            return '#NUM!';
        }

        if (!settlement.isAfter(lastInterest)) {
            return '#NUM!';
        }

        return oddLFunc(settlement, maturity, lastInterest, rate, yld, redemption, Math.floor(frequency), basis, true);
    };

    scope.ODDLYIELD = function(settlement, maturity, lastInterest, rate, pr, redemption, frequency, basis) {
        // Check for valid dates
        if (!moment(settlement).isValid() || !moment(maturity).isValid() || !moment(lastInterest).isValid()) {
            return '#VALUE!';
        }

        settlement   = moment(settlement);
        maturity     = moment(maturity);
        lastInterest = moment(lastInterest);

        if (rate < 0 || pr <= 0 || redemption < 0) {
            return '#NUM!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        if (!maturity.isAfter(settlement)) {
            return '#NUM!';
        }

        if (!settlement.isAfter(lastInterest)) {
            return '#NUM!';
        }

        return oddLFunc(settlement, maturity, lastInterest, rate, pr, redemption, Math.floor(frequency), basis, false);
    };

    return scope;

});