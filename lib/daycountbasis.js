
(function (definition) {
    if (typeof exports === "object") {
        var moment = require("moment");
        var Common = require("../lib/common.js");

        module.exports = definition(moment, Common);
    } else if (typeof define === "function" && define.amd) {
        define(['moment', 'common'], definition);
    }
})( function(moment, Common) {

    var scope = this.DayCount = {};

    // Basis
    var UsPsa30_360  = 0;
    var ActualActual = 1;
    var Actual360    = 2;
    var Actual365    = 3;
    var Europe30_360 = 4;

    var DayCountBasis = {};
    DayCountBasis.UsPsa30_360  = 0;
    DayCountBasis.ActualActual = 1;
    DayCountBasis.Actual360    = 2;
    DayCountBasis.Actual365    = 3;
    DayCountBasis.Europe30_360 = 4;

    scope.DayCountBasis = DayCountBasis;

    var Method360Us = {};
    Method360Us.ModifyStartDate = 0;
    Method360Us.ModifyBothDates = 1;

    scope.Method360Us = Method360Us;

    var NumDenumPosition = {};
    NumDenumPosition.Denumerator = 0;
    NumDenumPosition.Numerator   = 1;

    scope.NumDenumPosition = NumDenumPosition;

    scope.dateDiff360 = function(startDate, endDate) {
        var startDate = moment(startDate);
        var endDate   = moment(endDate);

        var sDay   = startDate.date();
        var sMonth = startDate.month();
        var sYear  = startDate.year();

        var eDay   = endDate.date();
        var eMonth = endDate.month();
        var eYear  = endDate.year();

        return (((eYear - sYear) * 360) + ((eMonth - sMonth) * 30) + (eDay - sDay));
    };

    scope.dateDiff365 = function(startDate, endDate) {
        var sDay   = startDate.date();
        var sMonth = startDate.month();
        var sYear  = startDate.year();

        var eDay   = endDate.date();
        var eMonth = endDate.month();
        var eYear  = endDate.year();

        var sd1 = sDay, sm1 = sMonth, sy1 = sYear, ed1 = eDay, em1 = eMonth, ey1 = eYear;
        var startDate1 = startDate.clone(), endDate1 = endDate.clone();

        if ((sd1 > 28) && (sm1 === 2)) {
            sd1 = 28;
        }

        if ((ed1 > 28) && (em1 === 2)) {
            ed1 = 28;
        }

        var startd = new moment(new Date(sy1, sm1, sd1));
        var endd   = new moment(new Date(ey1, em1, ed1));

        return ((ey1 - sy1) * 365 + endd.diff(startd, 'days'));
    };

    scope.dateDiff360Us = function(startDate, endDate, method360) {
        var sDay   = startDate.date();
        var sMonth = startDate.month();
        var sYear  = startDate.year();

        var eDay   = endDate.date();
        var eMonth = endDate.month();
        var eYear  = endDate.year();

        var sd1 = sDay, sm1 = sMonth, sy1 = sYear, ed1 = eDay, em1 = eMonth, ey1 = eYear;
        var startDate1 = startDate.clone(), endDate1 = endDate.clone();

        if (Common.isLastDayOfFebruary(endDate1) && (Common.isLastDayOfFebruary(startDate1) || method360 === Method360Us.ModifyStartDate)) {
            ed1 = 30;
        }

        if (ed1 === 31 && (sd1 >= 30 || method360 === Method360Us.ModifyBothDates)) {
            ed1 = 30;
        }

        if (sd1 === 31) {
            sd1 = 30;
        }

        if (Common.isLastDayOfFebruary(startDate1)) {
            sd1 = 30;
        }

        var d1 = moment(new Date(sy1, sm1, sd1));
        var d2 = moment(new Date(ey1, em1, ed1));

        return scope.dateDiff360(d1, d2);
    };

    scope.dateDiff360Eu = function(startDate, endDate) {
        var sDay   = startDate.date();
        var sMonth = startDate.month();
        var sYear  = startDate.year();

        var eDay   = endDate.date();
        var eMonth = endDate.month();
        var eYear  = endDate.year();

        var sd1 = sDay, sm1 = sMonth, sy1 = sYear, ed1 = eDay, em1 = eMonth, ey1 = eYear;
        var startDate1 = startDate.clone(), endDate1 = endDate.clone();

        if (sd1 === 31) {
            sd1 = 30;
        }

        if (ed1 === 31) {
            ed1 = 30;
        }

        var sDate = new moment(new Date(sy1, sm1, sd1));
        var eDate = new moment(new Date(ey1, em1, ed1));

        return scope.dateDiff360(sDate, eDate);
    };

    // Objects for different basis calculations
    var fUsPsa30_360 = (function() {
        var obj = {};

        obj.CoupDays = function(settl, mat, freq) {
            return 360/freq;
        };
        obj.CoupPCD = function(settl, mat, freq) {
            return scope.findPreviousCouponDate(settl, mat, freq, DayCountBasis.UsPsa30_360);
        };
        obj.CoupNCD = function(settl, mat, freq) {
            return scope.findNextCouponDate(settl, mat, freq, DayCountBasis.UsPsa30_360);
        };
        obj.CoupNum = function(settl, mat, freq) {
            return scope.numberOfCoupons(settl, mat, freq, DayCountBasis.UsPsa30_360);
        };
        obj.CoupDaysBS = function(settl, mat, freq) {
            var cpcd = obj.CoupPCD(settl, mat, freq);
            return scope.dateDiff360Us(cpcd, settl, Method360Us.ModifyStartDate);
        };
        obj.CoupDaysNC = function(settl, mat, freq) {
            var pdc           = scope.findPreviousCouponDate(settl, mat, freq, DayCountBasis.UsPsa30_360);
            var ndc           = scope.findNextCouponDate(settl, mat, freq, DayCountBasis.UsPsa30_360);
            var totDaysInCoup = scope.dateDiff360Us(pdc, ndc, Method360Us.ModifyBothDates);
            var daysToSettl   = scope.dateDiff360Us(pdc, settl, Method360Us.ModifyStartDate);

            return totDaysInCoup - daysToSettl;
        };
        obj.DaysBetween = function(issue, settl, position) {
            return scope.dateDiff360Us(issue, settl, Method360Us.ModifyStartDate);
        };
        obj.DaysInYear = function(issue, settl) {
            return 360;
        };
        obj.ChangeMonth = function(date, months, returnLastDay) {
            return scope.changeMonth(date, months, UsPsa30_360, returnLastDay);
        };

        return obj;
    })();

    var fEurope30_360 = (function() {
        var obj = {};

        obj.CoupDays = function(settl, mat, freq) {
            return 360/freq;
        };
        obj.CoupPCD = function(settl, mat, freq) {
            return scope.findPreviousCouponDate(settl, mat, freq, DayCountBasis.Europe30_360);
        };
        obj.CoupNCD = function(settl, mat, freq) {
            return scope.findNextCouponDate(settl, mat, freq, DayCountBasis.Europe30_360);
        };
        obj.CoupNum = function(settl, mat, freq) {
            return scope.numberOfCoupons(settl, mat, freq, DayCountBasis.Europe30_360);
        };
        obj.CoupDaysBS = function(settl, mat, freq) {
            var cpcd = obj.CoupPCD(settl, mat, freq);
            return scope.dateDiff360Eu(cpcd, settl);
        };
        obj.CoupDaysNC = function(settl, mat, freq) {
            var cncd = obj.CoupNCD(settl, mat, freq);
            return scope.dateDiff360Eu(settl, cncd);
        };
        obj.DaysBetween = function(issue, settl, position) {
            return scope.dateDiff360Eu(issue, settl);
        };
        obj.DaysInYear = function(issue, settl) {
            return 360;
        };
        obj.ChangeMonth = function(date, months, returnLastDay) {
            return scope.changeMonth(date, months, Europe30_360, returnLastDay);
        };

        return obj;
    })();

    var fActual360 = (function() {
        var obj = {};

        obj.CoupDays = function(settl, mat, freq) {
            return 360/freq;
        };
        obj.CoupPCD = function(settl, mat, freq) {
            return scope.findPreviousCouponDate(settl, mat, freq, DayCountBasis.Actual360);
        };
        obj.CoupNCD = function(settl, mat, freq) {
            return scope.findNextCouponDate(settl, mat, freq, DayCountBasis.Actual360);
        };
        obj.CoupNum = function(settl, mat, freq) {
            return scope.numberOfCoupons(settl, mat, freq, DayCountBasis.Actual360);
        };
        obj.CoupDaysBS = function(settl, mat, freq) {
            var cpcd = obj.CoupPCD(settl, mat, freq);
            return settl.diff(cpcd, 'days');
        };
        obj.CoupDaysNC = function(settl, mat, freq) {
            var cncd = obj.CoupNCD(settl, mat, freq);
            return cncd.diff(settl, 'days');
        };
        obj.DaysBetween = function(issue, settl, position) {
            if (position === NumDenumPosition.Numerator) {
                return settl.diff(issue, 'days');
            } else {
                return scope.dateDiff360Us(issue, settl, Method360Us.ModifyStartDate);
            }
        };
        obj.DaysInYear = function(issue, settl) {
            return 360;
        };
        obj.ChangeMonth = function(date, months, returnLastDay) {
            return scope.changeMonth(date, months, Actual360, returnLastDay);
        };

        return obj;
    })();

    var fActual365 = (function() {
        var obj = {};

        obj.CoupDays = function(settl, mat, freq) {
            return 365/freq;
        };
        obj.CoupPCD = function(settl, mat, freq) {
            return scope.findPreviousCouponDate(settl, mat, freq, DayCountBasis.Actual365);
        };
        obj.CoupNCD = function(settl, mat, freq) {
            return scope.findNextCouponDate(settl, mat, freq, DayCountBasis.Actual365);
        };
        obj.CoupNum = function(settl, mat, freq) {
            return scope.numberOfCoupons(settl, mat, freq, DayCountBasis.Actual365);
        };
        obj.CoupDaysBS = function(settl, mat, freq) {
            var cpcd = obj.CoupPCD(settl, mat, freq);
            return settl.diff(cpcd, 'days');
        };
        obj.CoupDaysNC = function(settl, mat, freq) {
            var cncd = obj.CoupNCD(settl, mat, freq);
            return cncd.diff(settl, 'days');
        };
        obj.DaysBetween = function(issue, settl, position) {
            if (position == NumDenumPosition.Numerator) {
                return settl.diff(issue, 'days');
            } else {
                return scope.dateDiff365(issue, settl);
            }
        };
        obj.DaysInYear = function(issue, settl) {
            return 365;
        };
        obj.ChangeMonth = function(date, months, returnLastDay) {
            return scope.changeMonth(date, months, Actual365, returnLastDay);
        };

        return obj;
    })();

    scope.actualCoupDays = function(settl, mat, freq) {
        var pcd = scope.findPreviousCouponDate(settl, mat, freq, DayCountBasis.ActualActual);
        var ncd = scope.findNextCouponDate(settl, mat, freq, DayCountBasis.ActualActual);
        return ncd.diff(pcd, 'days');
    };

    var fActualActual = (function() {
        var obj = {};

        obj.CoupDays = function(settl, mat, freq) {
            return scope.actualCoupDays(settl, mat, freq);
        };
        obj.CoupPCD = function(settl, mat, freq) {
            return scope.findPreviousCouponDate(settl, mat, freq, DayCountBasis.ActualActual);
        };
        obj.CoupNCD = function(settl, mat, freq) {
            return scope.findNextCouponDate(settl, mat, freq, DayCountBasis.ActualActual);
        };
        obj.CoupNum = function(settl, mat, freq) {
            return scope.numberOfCoupons(settl, mat, freq, DayCountBasis.ActualActual);
        };
        obj.CoupDaysBS = function(settl, mat, freq) {
            var cpcd = obj.CoupPCD(settl, mat, freq);
            return settl.diff(cpcd, 'days');
        };
        obj.CoupDaysNC = function(settl, mat, freq) {
            var cncd = obj.CoupNCD(settl, mat, freq);
            return cncd.diff(settl, 'days');
        };
        obj.DaysBetween = function(issue, settl, position) {
            return settl.diff(issue, 'days');
        };
        obj.DaysInYear = function(issue, settl) {
            if (!scope.lessOrEqualToAYearApart(issue, settl)) {
                var totalYears = (settl.year() - issue.year()) + 1;

                var d1 = moment(new Date(issue.year(), 1, 1));
                var d2 = moment(new Date(settl.year() + 1, 1, 1));

                var totalDays = d2.diff(d1, 'days');

                return (totalDays/totalYears);
            }
            else {
                if (scope.considerAsBisestile(issue, settl)) {
                    return 366;
                } else {
                    return 365;
                }
            }
        };
        obj.ChangeMonth = function(date, months, returnLastDay) {
            return scope.changeMonth(date, months, DayCountBasis.ActualActual, returnLastDay);
        };

        return obj;
    })();


    scope.DayCounts = [
            fUsPsa30_360,
            fActualActual,
            fActual360,
            fActual365,
            fEurope30_360
    ];

    scope.dayCount = function(basis) {
        if (basis >= 0 && basis <= 4) {
            return scope.DayCounts[basis];
        }
        return null;
    };

    scope.freq2months = function(freq) {
        return 12/freq;
    };

    scope.isLastDayOfMonthBasis = function(date,basis) {
        var d = date.date();
        return (Common.isLastDayOfMonth(date) || ((d === 30) && (basis === UsPsa30_360)));
    };

    scope.changeMonth = function(date, numMonths, basis, returnLastDay) {
        var origDate = date.clone();
        var newDate = origDate.add('months', numMonths);

        var lastDay = Common.lastDayOfMonth(newDate);

        if (returnLastDay) {
            return moment(new Date(newDate.year(), newDate.month(), lastDay));
        } else {
            return newDate;
        }
    };

    scope.noActionDates = function(d1, d2) {
        return 0;
    }

    scope.datesAggregate1 = function(startDate, endDate, numMonths, basis, f, acc, returnLastMonth) {

        var frontDate = startDate.clone();
        var trailingDate = endDate.clone();

        var s1 = (frontDate.isAfter(endDate) || frontDate.isSame(endDate));
        var s2 = (endDate.isAfter(frontDate) || endDate.isSame(frontDate));
        var stop = (numMonths > 0) ? s1 : s2;

        while (stop === false) {
            trailingDate = frontDate;
            frontDate = scope.changeMonth(frontDate, numMonths, basis, returnLastMonth);

            var func = f(frontDate, trailingDate);
            acc = acc + func;

            s1 = (frontDate.isAfter(endDate) || frontDate.isSame(endDate));
            s2 = (endDate.isAfter(frontDate) || endDate.isSame(frontDate));
            stop = (numMonths > 0) ? s1 : s2;

        }

        return [frontDate, trailingDate, acc];
    };

    scope.findPcdNcd = function(startDate, endDate, numMonths, basis, returnLastMonth) {
        var result = scope.datesAggregate1(startDate, endDate, numMonths, basis, scope.noActionDates, 0, returnLastMonth);
        return [result[0], result[1]];
    };

    scope.findCouponDates = function(settl, mat, freq, basis) {
        var endMonth = Common.isLastDayOfMonth(mat);
        var numMonths = -scope.freq2months(freq);
        return scope.findPcdNcd(mat, settl, numMonths, basis, endMonth); // returns list of 2
    };

    scope.findPreviousCouponDate = function(settl, mat, freq, basis) {
        return scope.findCouponDates(settl, mat, freq, basis)[0]; // return first of list
    };

    scope.findNextCouponDate = function(settl, mat, freq, basis) {
        return scope.findCouponDates(settl, mat, freq, basis)[1]; // return second of list
    };

    scope.numberOfCoupons = function(settl, mat, freq, basis) {
        var pcdate = scope.findPreviousCouponDate(settl, mat, freq, basis);

        var pcy = pcdate.year();
        var pcm = pcdate.month();

        var my = mat.year();
        var mm = mat.month();

        var months = (my - pcy) * 12 + (mm - pcm);
        return months * freq/12;
    };

    scope.lessOrEqualToAYearApart = function(date1, date2) {
        var y1 = date1.year(),  y2 = date2.year();
        var m1 = date1.month(), m2 = date2.month();
        var d1 = date1.date(),  d2 = date2.date();

        return ((y1 === y2) || ( (y2 === (y1 + 1)) && ( (m1 > m2) || ((m1 === m2) && d1 >= d2) )));
    };

    scope.isFeb29BetweenConsecutiveYears = function(date1, date2) {
        var y1 = date1.year(),  y2 = date2.year();
        var m1 = date1.month(), m2 = date2.month();
        var d1 = date1.date(),  d2 = date2.date();

        if ( (y1 === y2) && date1.isLeapYear()) {
            return ( (m1 <= 2) &&  (m2 > 2) );
        }
        if (y1 === y2) {
            return false;
        }
        if (y2 === (y1 + 1)) {
            if (date1.isLeapYear()) {
                return (m1 <= 2);
            } else {
                if (date2.isLeapYear()) {
                    return (m2 > 2);
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    scope.considerAsBisestile = function(date1, date2) {
        var y1 = date1.year(),  y2 = date2.year();
        var m1 = date1.month(), m2 = date2.month();
        var d1 = date1.date(),  d2 = date2.date();

        return ( ( (y1 === y2) && date1.isLeapYear())
            || (m2 === 2 && d2 === 29)
            || scope.isFeb29BetweenConsecutiveYears(date1, date2));
    };


    // Function Implementations

    scope.COUPDAYS = function(settlement, maturity, frequency, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof frequency !== "number" || typeof basis !== "number") {
            return '#VALUE!';
        }

        // Check for valid dates
        if (!moment(settlement).isValid() || !moment(maturity).isValid()) {
            return '#VALUE!';
        }

        // Check for valid frequency
        if ([1,2,4].indexOf(frequency) === -1) {
            return '#NUM!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        maturity   = moment(maturity);
        settlement = moment(settlement);

        // Check for maturity > settlement
        if (!maturity.isAfter(settlement)) {
            return '#NUM!';
        }

        var dc = DayCount.dayCount(basis);
        return dc.CoupDays(settlement, maturity, frequency);
    };

    scope.COUPPCD = function(settlement, maturity, frequency, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof frequency !== "number" || typeof basis !== "number") {
            return '#VALUE!';
        }

        // Check for valid dates
        if (!moment(settlement).isValid() || !moment(maturity).isValid()) {
            return '#VALUE!';
        }

        // Check for valid frequency
        if ([1,2,4].indexOf(frequency) === -1) {
            return '#NUM!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        maturity   = moment(maturity);
        settlement = moment(settlement);

        // Check for maturity > settlement
        if (!maturity.isAfter(settlement)) {
            return '#NUM!';
        }

        var dc = DayCount.dayCount(basis);
        return dc.CoupPCD(settlement, maturity,frequency);
    };


    scope.COUPNCD = function(settlement, maturity, frequency, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof frequency !== "number" || typeof basis !== "number") {
            return '#VALUE!';
        }

        // Check for valid dates
        if (!moment(settlement).isValid() || !moment(maturity).isValid()) {
            return '#VALUE!';
        }

        // Check for valid frequency
        if ([1,2,4].indexOf(frequency) === -1) {
            return '#NUM!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        maturity   = moment(maturity);
        settlement = moment(settlement);

        // Check for maturity > settlement
        if (!maturity.isAfter(settlement)) {
            return '#NUM!';
        }

        var dc = DayCount.dayCount(basis);
        return dc.CoupNCD(settlement, maturity, frequency);
    };

    scope.COUPNUM = function(settlement, maturity, frequency, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof frequency !== "number" || typeof basis !== "number") {
            return '#VALUE!';
        }

        // Check for valid dates
        if (!moment(settlement).isValid() || !moment(maturity).isValid()) {
            return '#VALUE!';
        }

        // Check for valid frequency
        if ([1,2,4].indexOf(frequency) === -1) {
            return '#NUM!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        maturity   = moment(maturity);
        settlement = moment(settlement);

        // Check for maturity > settlement
        if (!maturity.isAfter(settlement)) {
            return '#NUM!';
        }

        var dc = DayCount.dayCount(basis);
        return dc.CoupNum(settlement, maturity, frequency);
    };

    scope.COUPDAYBS = function(settlement, maturity, frequency, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof frequency !== "number" || typeof basis !== "number") {
            return '#VALUE!';
        }

        // Check for valid dates
        if (!moment(settlement).isValid() || !moment(maturity).isValid()) {
            return '#VALUE!';
        }

        // Check for valid frequency
        if ([1,2,4].indexOf(frequency) === -1) {
            return '#NUM!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        maturity   = moment(maturity);
        settlement = moment(settlement);

        // Check for maturity > settlement
        if (!maturity.isAfter(settlement)) {
            return '#NUM!';
        }

        var dc = DayCount.dayCount(basis);
        return dc.CoupDaysBS(settlement, maturity, frequency);
    };

    scope.COUPDAYSNC = function(settlement, maturity, frequency, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof frequency !== "number" || typeof basis !== "number") {
            return '#VALUE!';
        }

        // Check for valid dates
        if (!moment(settlement).isValid() || !moment(maturity).isValid()) {
            return '#VALUE!';
        }

        // Check for valid frequency
        if ([1,2,4].indexOf(frequency) === -1) {
            return '#NUM!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        maturity   = moment(maturity);
        settlement = moment(settlement);

        // Check for maturity > settlement
        if (!maturity.isAfter(settlement)) {
            return '#NUM!';
        }

        var dc = DayCount.dayCount(basis);
        return dc.CoupDaysNC(settlement, maturity, frequency);
    };

    scope.YEARFRAC = function(startDate, endDate, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof basis !== "number") {
            return '#VALUE!';
        }

        // Check for valid dates
        if (!moment(startDate).isValid() || !moment(endDate).isValid()) {
            return '#VALUE!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0,1,2,3,4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        startDate = moment(startDate);
        endDate   = moment(endDate);

        // Check for endDate > startDate
        if (!endDate.isAfter(startDate)) {
            return "#NUM!";
        }

        var dc = DayCount.dayCount(basis);
        return (dc.DaysBetween(startDate, endDate, DayCount.NumDenumPosition.Numerator) / dc.DaysInYear(startDate, endDate));
    };

    return scope;
});
