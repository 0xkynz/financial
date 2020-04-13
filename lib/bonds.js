(function (definition) {
    if (typeof exports === "object") {
        var moment   = require("moment");
        var Common   = require("../lib/common.js");
        var DayCount = require("../lib/daycountbasis.js");

        module.exports = definition(moment, Common, DayCount);
    } else if (typeof define === "function" && define.amd) {
        define(['moment', 'common', 'daycountbasis'], definition);
    }
})(function (moment, Common, DayCount) {
    var scope = this.Bonds = {};

    var getPriceYieldFactors = function(settlement, maturity, frequency, basis) {
        var dc  = DayCount.dayCount(basis);
        var n   = dc.CoupNum(settlement, maturity, frequency);
        var pcd = dc.CoupPCD(settlement, maturity, frequency);
        var a   = dc.DaysBetween(pcd, settlement, DayCount.NumDenumPosition.Numerator);
        var e   = dc.CoupDays(settlement, maturity, frequency);
        var dsc = e - a;

        return [n, pcd, a, e, dsc];
    }

    var yieldFunc = function(settlement, maturity, rate, pr, redemption, frequency, basis) {

        var priceYieldFactors = getPriceYieldFactors(settlement, maturity, frequency, basis);

        var n   = priceYieldFactors[0];
        var pcd = priceYieldFactors[1];
        var a   = priceYieldFactors[2];
        var e   = priceYieldFactors[3];
        var dsr = priceYieldFactors[4];

        if (n <= 1) {
            var par      = 100; // Logical inference from Excel's docs
            var firstNum = (redemption / 100 + rate / frequency) - (par / 100 + (a / e * rate /frequency));
            var firstDen = par / 100 + (a / e * rate / frequency);

            return firstNum / firstDen * frequency * e / dsr;
        } else {
            var f = function(yld) {
                return scope.PRICE(settlement, maturity, rate, yld, redemption, frequency, basis) - pr;
            };

            return Common.findRoot(f, 0.05);
        }
    };

    var getMatFactors = function(settlement, maturity, issue, basis) {
        var dc  = DayCount.dayCount(basis);
        var b   = dc.DaysInYear(issue, settlement);
        var dim = dc.DaysBetween(issue, maturity, DayCount.NumDenumPosition.Numerator);
        var a   = dc.DaysBetween(issue, settlement, DayCount.NumDenumPosition.Numerator);
        var dsm = dim - a;

        return [b, dim, a, dsm];
    };

    var getCommonFactors = function(settlement, maturity, basis) {
        var dc  = DayCount.dayCount(basis);
        var dim = dc.DaysBetween(settlement, maturity, DayCount.NumDenumPosition.Numerator);
        var b   = dc.DaysInYear(settlement, maturity);

        return [dim, b];
    };

    var duration = function(settlement, maturity, coupon, yld, frequency, basis, isMDuration) {
        var dc  = DayCount.dayCount(basis);
        var dbc = dc.CoupDaysBS(settlement, maturity, frequency);
        var e   = dc.CoupDays(settlement, maturity, frequency);
        var n   = dc.CoupNum(settlement, maturity, frequency);
        var dsc = e - dbc;

        var x1 = dsc / e;
        var x2 = x1 + n - 1;
        var x3 = yld / frequency + 1;
        var x4 = Math.pow(x3, x2);

        //( x4 <> 0.) |> elseThrow "(yld / frequency + 1)^((dsc / e) + n -1) must be different from 0)"

        if (x4 === 0) {
            // Return an error???
        }

        var term1 = x2 * 100 / x4;
        var term3 = 100 / x4;

        var aggrFunction = function(acc, index) {
            var x5 = index - 1 + x1;
            var x6 = Math.pow(x3, x5);

            //( x6 <> 0.) |> elseThrow "x6 must be different from 0)"
            if (x6 === 6) {
                // Return an error??
            }

            var x7 = (100 * coupon / frequency) / x6;
            var a  = acc[0];
            var b  = acc[1];

            return [a + x7 * x5, b + x7];
        };

        var ag    = Common.aggrBetween(1, n, aggrFunction, [0,0]);
        var term2 = ag[0];
        var term4 = ag[1];

        var term5 = term1 + term2;
        var term6 = term3 + term4;

        //( term6 <> 0.) |> elseThrow "term6 must be different from 0)"
        if (term6 === 0) {
            // Return an error??
        }

        if (isMDuration === false) {
            return (term5 / term6) / frequency;
        } else {
            return ((term5 / term6) / frequency) / x3;
        }
    };


    // Function Implementations

    scope.ACCRINT = function(issue, first, settlement, rate, par, frequency, basis, method) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        if (method === null || method === undefined) {
            method = true;
        }

        // Check param types
        if (typeof rate !== "number" || typeof par !== "number" || typeof frequency !== "number" ||
            typeof basis != "number") {
            return '#VALUE!';
        }

        //Return error if either date is invalid
        if (!moment(issue).isValid() || !moment(first).isValid() || !moment(settlement).isValid()) {
            return '#VALUE!';
        }

        // Return error if either rate or par are lower than or equal to zero
        if (rate <= 0 || par <= 0) {
            return '#NUM!';
        }

        // Return error if frequency is neither 1, 2, or 4
        if ([1,2,4].indexOf(frequency) === -1) {
            return '#NUM!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // Return error if issue greater than or equal to settlement
        if (moment(issue).diff(moment(settlement)) >= 0) {
            return '#NUM!';
        }

        // Set default values
        par    = (typeof par === 'undefined') ? 0 : 1000;

        var issue         = moment(issue);
        var first         = moment(first);
        var firstInterest = first.clone();
        var settlement    = moment(settlement);

        var dc           = DayCount.dayCount(basis);
        var freq         = frequency;
        var numMonths    = DayCount.freq2months(freq);
        var numMonthsNeg = -numMonths;
        var endMonthBond = Common.isLastDayOfMonth(first);

        if (method === true) {
            method = Common.AccrIntCalcMethod.FromIssueToSettlement;
        }
        else {
            method = Common.AccrIntCalcMethod.FromFirstToSettlement;
        }

        var pcd = null;

        if (settlement.isAfter(firstInterest) && (method === Common.AccrIntCalcMethod.FromIssueToSettlement)) {
            pcd = DayCount.findPcdNcd(firstInterest, settlement, numMonths, basis, endMonthBond)[0];
        } else {
            pcd = dc.ChangeMonth(firstInterest, numMonthsNeg, endMonthBond);
        }

        var firstDate = issue.isAfter(pcd) ? issue : pcd;
        var days      = dc.DaysBetween(firstDate, settlement, DayCount.NumDenumPosition.Numerator);
        var coupDays  = dc.CoupDays(pcd, firstInterest, freq);

        var aggFunction = function(apcd,ancd) {

            var afirstDate = issue.isAfter(apcd) ? issue : apcd;
            var adays = null;

            if (basis === DayCount.DayCountBasis.UsPsa30_360) {
                var psaMethod = ((issue.isAfter(apcd)) ? DayCount.Method360Us.ModifyStartDate : DayCount.Method360Us.ModifyBothDates);
                adays = DayCount.dateDiff360Us(afirstDate, ancd, psaMethod);
            } else {
                adays = dc.DaysBetween(afirstDate, ancd, DayCount.NumDenumPosition.Numerator);
            }

            var acoupDays = null;

            if (basis === DayCount.DayCountBasis.UsPsa30_360) {
                acoupDays = DayCount.dateDiff360Us(apcd, ancd, DayCount.Method360Us.ModifyBothDates);
            } else {
                if (basis === DayCount.DayCountBasis.Actual365) {
                    acoupDays = 365/freq;
                } else {
                    acoupDays = dc.DaysBetween(apcd, ancd, DayCount.NumDenumPosition.Denumerator);
                }
            }

            var result = null;

            if (apcd.isAfter(issue) || apcd.isSame(issue)) {
                result = method;
            } else {
                result = (adays/acoupDays);
            }

            return result;
        };

        var result = DayCount.datesAggregate1(pcd, issue, numMonthsNeg, basis, aggFunction, (days/coupDays), endMonthBond);
        var a      = result[2];

        return (par * rate/freq * a);
    };

    scope.ACCRINTM = function (issue, settlement, rate, par, basis) {
        // Check for optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check param types
        if (typeof rate !== "number" || typeof par !== "number" || typeof basis !== "number") {
            return '#VALUE!';
        }

        // Return error if either date is invalid
        if (!moment(issue).isValid() || !moment(settlement).isValid()) {
            return '#VALUE!';
        }

        // Return error if either rate or par are lower than or equal to zero
        if (rate <= 0 || par <= 0) {
            return '#NUM!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // Return error if issue greater than or equal to settlement
        if (moment(issue).diff(moment(settlement)) >= 0) {
            return '#NUM!';
        }

        issue      = moment(issue);
        settlement = moment(settlement);

        var dc         = DayCount.dayCount(basis);
        var days       = dc.DaysBetween(issue, settlement, DayCount.NumDenumPosition.Numerator);
        var daysInYear = dc.DaysInYear(issue, settlement);

        return par * rate * (days/daysInYear);
    };


    scope.PRICE = function(settlement, maturity, rate, yld, redemption, frequency, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof rate !== "number" || typeof yld !== "number" || typeof redemption !== "number" ||
            typeof frequency !== "number" || typeof basis !== "number") {
            return '#VALUE!';
        }

        //Return error if either date is invalid
        if (!moment(maturity).isValid() || !moment(settlement).isValid()) {
            return '#VALUE!';
        }

        // Return error if either rate or yield are lower than zero
        if (rate < 0 || yld < 0) {
            return '#NUM!';
        }

        // Return error if redemption is less than or equal to zero
        if (redemption <= 0) {
            return '#NUM!';
        }

        // If frequency is any number other than 1, 2, or 4, returns the #NUM! error value.
        if ([1,2,4].indexOf(frequency) === -1) {
            return '#NUM!';
        }

        // If basis < 0 or if basis > 4, PRICE returns the #NUM! error value.
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // If settlement ≥ maturity, PRICE returns the #NUM! error value
        if (moment(settlement).diff(moment(maturity)) >= 0) {
            return '#NUM!';
        }

        settlement = moment(settlement);
        maturity   = moment(maturity);

        var pyf = getPriceYieldFactors(settlement, maturity, frequency, basis);
        var n   = pyf[0];
        var pcd = pyf[1];
        var a   = pyf[2];
        var e   = pyf[3];
        var dsc = pyf[4];

        var coupon  = 100 * rate/frequency;
        var accrInt = 100 * rate/frequency * a/e;

        var pvFactor = function(k) {
            var base = 1 + yld/frequency;
            var exp  = k - 1 + dsc/e;

            return Math.pow(base, exp);
        };

        var pvOfRedemption = redemption / pvFactor(n);
        var pvOfCoupons    = 0;

        for (var k = 1; k <= n; k++) {
            pvOfCoupons = pvOfCoupons + coupon/pvFactor(k);
        }

        if (n === 1) {
            return (redemption + coupon)/(1 + dsc/e * yld/frequency) - accrInt;
        } else {
            return pvOfRedemption + pvOfCoupons - accrInt;
        }
    };

    scope.PRICEMAT = function(settlement, maturity, issue, rate, yld, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof rate !== "number" || typeof yld !== "number" || typeof basis !== "number") {
            return '#VALUE!';
        }

        //Return error if either date is invalid
        if (!moment(maturity).isValid() || !moment(settlement).isValid() || !moment(issue).isValid()) {
            return '#VALUE!';
        }

        // Return error if either rate or yield are lower than zero
        if (rate < 0 || yld < 0) {
            return '#NUM!';
        }

        // If basis < 0 or if basis > 4, returns the #NUM! error value.
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // If settlement ≥ maturity, returns the #NUM! error value
        if (moment(settlement).diff(moment(maturity)) >= 0) {
            return '#NUM!';
        }

        settlement = moment(settlement);
        maturity   = moment(maturity);
        issue      = moment(issue);

        var matFactors = getMatFactors(settlement, maturity, issue, basis);

        var b   = matFactors[0];
        var dim = matFactors[1];
        var a   = matFactors[2];
        var dsm = matFactors[3];

        var num1  = 100 + (dim / b * rate * 100);
        var den1  = 1 + (dsm / b * yld);
        var fact2 = (a / b * rate * 100);

        return num1 / den1 - fact2;
    };

    scope.YIELDMAT = function(settlement, maturity, issue, rate, pr, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof rate !== "number" || typeof pr !== "number" || typeof basis !== "number") {
            return '#VALUE!';
        }

        //Return error if either date is invalid
        if (!moment(maturity).isValid() || !moment(settlement).isValid() || !moment(issue).isValid()) {
            return '#VALUE!';
        }

        // Return error if either rate or pr are lower than zero
        if (rate < 0 || pr <= 0) {
            return '#NUM!';
        }

        // If basis < 0 or if basis > 4, returns the #NUM! error value.
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // If settlement ≥ maturity, returns the #NUM! error value
        if (moment(settlement).diff(moment(maturity)) >= 0) {
            return '#NUM!';
        }

        settlement = moment(settlement);
        maturity   = moment(maturity);
        issue      = moment(issue);

        var matFactors = getMatFactors(settlement, maturity, issue, basis);

        var b   = matFactors[0];
        var dim = matFactors[1];
        var a   = matFactors[2];
        var dsm = matFactors[3];

        var term1 = dim / b * rate + 1 - pr / 100 - a / b * rate;
        var term2 = pr / 100 + a / b * rate;
        var term3 = b / dsm;

        return term1 / term2 * term3;
    };

    scope.INTRATE = function(settlement, maturity, investment, redemption, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof investment !== "number" || typeof redemption !== "number" || typeof basis !== "number") {
            return '#VALUE!';
        }

        //Return error if either date is invalid
        if (!moment(maturity).isValid() || !moment(settlement).isValid()) {
            return '#VALUE!';
        }

        // Return error if either investment or redemption are lower than zero
        if (investment <= 0 || redemption <= 0) {
            return '#NUM!';
        }

        // If basis < 0 or if basis > 4, returns the #NUM! error value.
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // If settlement ≥ maturity, returns the #NUM! error value
        if (moment(settlement).diff(moment(maturity)) >= 0) {
            return '#NUM!';
        }

        settlement = moment(settlement);
        maturity   = moment(maturity);

        var commonFactors = getCommonFactors(settlement, maturity, basis);
        var dim           = commonFactors[0];
        var b             = commonFactors[1];

        return (redemption - investment) / investment * b /dim;
    };

    scope.RECEIVED = function(settlement, maturity, investment, discount, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof discount !== "number" || typeof basis !== "number") {
            return '#VALUE!';
        }

        //Return error if either date is invalid
        if (!moment(maturity).isValid() || !moment(settlement).isValid()) {
            return '#VALUE!';
        }

        // Return error if either investment or discount are lower than zero
        if (investment <= 0 || discount <= 0) {
            return '#NUM!';
        }

        // If basis < 0 or if basis > 4, returns the #NUM! error value.
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // If settlement ≥ maturity, returns the #NUM! error value
        if (moment(settlement).diff(moment(maturity)) >= 0) {
            return '#NUM!';
        }

        settlement = moment(settlement);
        maturity   = moment(maturity);

        var commonFactors = getCommonFactors(settlement, maturity, basis);
        var dim           = commonFactors[0];
        var b             = commonFactors[1];

        var discountFactor = discount * dim / b;
        // To get the following check into the precondition testing requires calculating the discountFactor twice, so I don't do it ...
        // discountFactor < 1.   |> elseThrow "discount * dim / b must be different from 1"
        return investment / ( 1 - discountFactor );
    };

    scope.DISC = function(settlement, maturity, pr, redemption, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof pr !== "number" || typeof redemption !== "number" || typeof basis !== "number") {
            return '#VALUE!';
        }

        //Return error if either date is invalid
        if (!moment(maturity).isValid() || !moment(settlement).isValid()) {
            return '#VALUE!';
        }

        // Return error if either pr or redemption are lower than zero
        if (pr <= 0 || redemption <= 0) {
            return '#NUM!';
        }

        // If basis < 0 or if basis > 4, returns the #NUM! error value.
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // If settlement ≥ maturity, returns the #NUM! error value
        if (moment(settlement).diff(moment(maturity)) >= 0) {
            return '#NUM!';
        }

        settlement = moment(settlement);
        maturity   = moment(maturity);

        var commonFactors = getCommonFactors(settlement, maturity, basis);
        var dim           = commonFactors[0];
        var b             = commonFactors[1];

        return (-pr / redemption + 1) * b / dim;
    };

    scope.PRICEDISC = function(settlement, maturity, discount, redemption, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof discount !== "number" || typeof redemption !== "number" || typeof basis !== "number") {
            return '#VALUE!';
        }

        //Return error if either date is invalid
        if (!moment(maturity).isValid() || !moment(settlement).isValid()) {
            return '#VALUE!';
        }

        // Return error if either discount or redemption are lower than zero
        if (discount <= 0 || redemption <= 0) {
            return '#NUM!';
        }

        // If basis < 0 or if basis > 4, returns the #NUM! error value.
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // If settlement ≥ maturity, returns the #NUM! error value
        if (moment(settlement).diff(moment(maturity)) >= 0) {
            return '#NUM!';
        }

        settlement = moment(settlement);
        maturity   = moment(maturity);

        var commonFactors = getCommonFactors(settlement, maturity, basis);
        var dim           = commonFactors[0];
        var b             = commonFactors[1];

        return redemption - discount * redemption * dim / b;
    };

    scope.YIELDDISC = function(settlement, maturity, pr, redemption, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof pr !== "number" || typeof redemption !== "number" || typeof basis !== "number") {
            return '#VALUE!';
        }

        //Return error if either date is invalid
        if (!moment(maturity).isValid() || !moment(settlement).isValid()) {
            return '#VALUE!';
        }

        // Return error if either pr or redemption are lower than zero
        if (pr <= 0 || redemption <= 0) {
            return '#NUM!';
        }

        // If basis < 0 or if basis > 4, returns the #NUM! error value.
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // If settlement ≥ maturity, returns the #NUM! error value
        if (moment(settlement).diff(moment(maturity)) >= 0) {
            return '#NUM!';
        }

        settlement = moment(settlement);
        maturity   = moment(maturity);

        var commonFactors = getCommonFactors(settlement, maturity, basis);
        var dim           = commonFactors[0];
        var b             = commonFactors[1];

        return (redemption - pr) / pr * b / dim;
    };

    scope.DURATION = function(settlement, maturity, coupon, yld, frequency, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof coupon !== "number" || typeof yld !== "number" || typeof basis !== "number" ||
            typeof frequency !== "number") {
            return '#VALUE!';
        }

        //Return error if either date is invalid
        if (!moment(maturity).isValid() || !moment(settlement).isValid()) {
            return '#VALUE!';
        }

        // Return error if either pr or redemption are lower than zero
        if (coupon < 0 || yld < 0) {
            return '#NUM!';
        }

        // If frequency is any number other than 1, 2, or 4, returns the #NUM! error value.
        if ([1,2,4].indexOf(frequency) === -1) {
            return '#NUM!';
        }

        // If basis < 0 or if basis > 4, returns the #NUM! error value.
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // If settlement ≥ maturity, returns the #NUM! error value
        if (moment(settlement).diff(moment(maturity)) >= 0) {
            return '#NUM!';
        }

        settlement = moment(settlement);
        maturity   = moment(maturity);

        return duration(settlement, maturity, coupon, yld, frequency, basis, false);
    };

    scope.MDURATION = function(settlement, maturity, coupon, yld, frequency, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof coupon !== "number" || typeof yld !== "number" || typeof basis !== "number" ||
            typeof frequency !== "number") {
            return '#VALUE!';
        }

        //Return error if either date is invalid
        if (!moment(maturity).isValid() || !moment(settlement).isValid()) {
            return '#VALUE!';
        }

        // Return error if either pr or redemption are lower than zero
        if (coupon < 0 || yld < 0) {
            return '#NUM!';
        }

        // If frequency is any number other than 1, 2, or 4, returns the #NUM! error value.
        if ([1,2,4].indexOf(frequency) === -1) {
            return '#NUM!';
        }

        // If basis < 0 or if basis > 4, returns the #NUM! error value.
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // If settlement ≥ maturity, returns the #NUM! error value
        if (moment(settlement).diff(moment(maturity)) >= 0) {
            return '#NUM!';
        }

        settlement = moment(settlement);
        maturity   = moment(maturity);

        return duration(settlement, maturity, coupon, yld, frequency, basis, true);
    };


    return scope;
});
