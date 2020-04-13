
(function (definition) {
    if (typeof exports === "object") {
        var moment   = require("moment");
        var Common   = require("../lib/common.js");
        var DayCount = require("../lib/daycountbasis.js");

        module.exports = definition(moment, Common, DayCount);
    } else if (typeof define === "function" && define.amd) {
        define(['moment', 'common', 'daycountbasis'], definition);
    }
})( function(moment, Common, DayCount) {

    var scope = this.Depreciation = {};

    var deprRate = function(cost, salvage, life) {
        var val = 1 - Math.pow(salvage/cost, 1/life);
        return parseFloat(val.toFixed(3));
    };

    var deprForPeriod = function(cost, totDepr, rate) {
        return (cost - totDepr) * rate;
    };

    var deprForFirstPeriod = function(cost, rate, month) {
        return cost * rate * month / 12;
    };

    var deprForLastPeriod = function(cost, totDepr, rate, month) {
        return (( cost - totDepr) * rate * ( 12 - month)) / 12;
    };

    var db = function(cost, salvage, life, period, month) {

        var rate    = deprRate(cost, salvage, life);
        var per     = 0;
        var totDepr = 0;

        while (per < period) {

            if (per === 0) {
                var depr = deprForFirstPeriod(cost, rate, month);
                if (Math.floor(period) <= 1) {
                    return depr;
                } else {
                    totDepr = depr;
                    per = per + 1;
                }
            }
            else {
                if (period <= life) {
                    if (per === (Math.floor(period) - 1)) {
                        return deprForPeriod(cost, totDepr, rate);
                    }
                    else if (per === (Math.floor(life) - 1)) {
                        return deprForLastPeriod(cost, totDepr, rate, month);
                    } else {
                        var depr = deprForPeriod(cost, totDepr, rate);
                        totDepr = totDepr + depr;
                    }
                } else { // Modified for case when period > life
                    // if (per === (Math.floor(life) - 1)) {
                    //     return deprForPeriod(cost, totDepr, rate);
                    // }
                    if (per === (Math.floor(period) - 1)) {
                        return deprForLastPeriod(cost, totDepr, rate, month);
                    } else {
                        var depr = deprForPeriod(cost, totDepr, rate);
                        totDepr = totDepr + depr;
                    }
                }
                per = per + 1;
            }
        }
    };

    var sln = function(cost, salvage, life) {
        return (cost - salvage)/life;
    };

    var syd = function(cost, salvage, life, per) {
        return ((cost - salvage) * (life - per + 1) * 2) / (life * (life + 1));
    };

    var totalDepr = function(cost, salvage, life, period, factor, straightLine) {

        var _ddb = function(totDepr, per) {
            var frac = Common.rest(period);

            var ddbDeprFormula = function(totDepr) {
                return Math.min( (cost - totDepr) * (factor / life), (cost - salvage - totDepr) );
            };

            var slnDeprFormula = function(totDepr, aPeriod) {
                return scope.SLN(cost - totDepr, salvage, life - aPeriod);
            };

            var ddbDepr = ddbDeprFormula(totDepr);
            var slnDepr = slnDeprFormula(totDepr, per);

            var isSln        = straightLine && (ddbDepr < slnDepr);
            var depr         = (isSln === true) ? slnDepr : ddbDepr;
            var newTotalDepr = totDepr + depr;

            if (Math.floor(period) === 0) {
                return newTotalDepr * frac;
            } else if (Math.floor(per) === (Math.floor(period) - 1)) {
                var ddbDeprNextPeriod = ddbDeprFormula(newTotalDepr);
                var slnDeprNextPeriod = slnDeprFormula(newTotalDepr, per + 1);
                var isSlnNextPeriod   = straightLine && (ddbDeprNextPeriod < slnDeprNextPeriod);

                var deprNextPeriod = null;

                if (isSlnNextPeriod) {
                    if (Math.floor(period) === Math.floor(life)) {
                        deprNextPeriod = 0;
                    }
                    else {
                        deprNextPeriod = slnDeprNextPeriod;
                    }
                } else {
                    deprNextPeriod = ddbDeprNextPeriod;
                }

                return newTotalDepr + deprNextPeriod * frac;

            } else {
                return _ddb(newTotalDepr, per + 1);
            }
        };

        return _ddb(0,0);
    };

    var deprBetweenPeriods = function(cost, salvage, life, startPeriod, endPeriod, factor, straightLine) {
        return (totalDepr(cost, salvage, life, endPeriod, factor, straightLine) -
                totalDepr(cost, salvage, life, startPeriod, factor, straightLine));
    };

    var ddb = function(cost, salvage, life, period, factor) {
        if (period >= 2) {
            return deprBetweenPeriods(cost, salvage, life, period - 1, period, factor, false);
        } else {
            return totalDepr(cost, salvage, life, period, factor, false);
        }
    };

    var vdb = function(cost, salvage, life, startPeriod, endPeriod, factor, bflag) {
        if (bflag === Common.VdbSwitch.DontSwitchToStraightLine) {
            return deprBetweenPeriods(cost, salvage, life, startPeriod, endPeriod, factor, false);
        } else {
            return deprBetweenPeriods(cost, salvage, life, startPeriod, endPeriod, factor, true);
        }
    };

    var daysInYear = function(date, basis) {
        if (basis === DayCount.DayCountBasis.ActualActual) {
            if (date.isLeapYear()) {
                return 366;
            } else {
                return 365;
            }
        } else {
            var dc = DayCount.dayCount(basis);
            return dc.DaysInYear(date, date);
        }
    };

    var firstDeprLinc = function(cost, datePurch, firstP, salvage, rate, assLife, basis) {
        var fix29February = function(d1) {
            var y = d1.year();
            var m = d1.month();
            var d = d1.date();

            if ((basis === DayCount.DayCountBasis.ActualActual || basis === DayCount.DayCountBasis.Actual365) && d1.isLeapYear() && m === 2 && d >= 28) {
                return moment(new Date(y,m,28));
            } else {
                return d1;
            }
        };

        var dc            = DayCount.dayCount(basis);
        var daysInYr      = daysInYear(datePurch, basis);
        var datePurchased = fix29February(datePurch);
        var firstPeriod   = fix29February(firstP);

        var firstLen      = dc.DaysBetween(datePurchased, firstPeriod, DayCount.NumDenumPosition.Numerator);
        var firstDeprTemp = firstLen / daysInYr * rate * cost;
        var firstDepr     = ((firstDeprTemp === 0) ? cost * rate : firstDeprTemp);

        var assetLife = ((firstDeprTemp === 0) ? assLife : assLife + 1);
        var availDepr = cost - salvage;

        if (firstDepr > availDepr) {
            return [availDepr, assetLife];
        }
        else {
            return [firstDepr, assetLife];
        }
    };

    var amorlinc = function(cost, datePurchased, firstPeriod, salvage, period, rate, basis) {
        var assetLifeTemp = Math.ceil(1 / rate);

        var findDepr = function(countedPeriod, depr, availDepr) {
            if (countedPeriod > period) {
                return depr;
            }
            else {
                var depr          = (depr > availDepr) ? availDepr : depr;
                var availDeprTemp = availDepr - depr;
                var availDepr     = (availDeprTemp < 0) ? 0 : availDeprTemp;

                return findDepr(countedPeriod + 1, depr, availDepr);
            }
        };

        if ((cost === salvage) || (period > assetLifeTemp)) {
            return 0;
        }
        else {
            var firstDepr = firstDeprLinc(cost, datePurchased, firstPeriod, salvage, rate, assetLifeTemp, basis)[0];
            if (period === 0) {
                return firstDepr;
            }
            else {
                return findDepr(1, rate * cost, cost - salvage - firstDepr);
            };
        }
    };

    var deprCoeff = function(assetLife) {
        var between = function(x1, x2) {
            return ((assetLife >= x1) && (assetLife <= x2));
        };
        if (between(3, 4)) {
            return 1.5;
        } else if (between(5,6)) {
            return 2;
        } else if (assetLife > 6) {
            return 2.5;
        } else {
            return 1;
        }
    };

    var amordegrc = function(cost, datePurchased, firstPeriod, salvage, period, rate, basis, excelComplaint) {
        var assLife = Math.ceil(1 / rate);
        if ((cost === salvage) || (period > assLife)) {
            return 0;
        }
        else {
            var dCoeff        = deprCoeff(assLife);
            var deprR         = rate * dCoeff;
            var fdl           = firstDeprLinc(cost, datePurchased, firstPeriod, salvage, deprR, assLife, basis);
            var fDeprLinc     = fdl[0];
            var assetLife     = fdl[1];
            var firstDepr     = Common.round(excelComplaint, fDeprLinc);

            var findDepr = function(countedPeriod, depr, deprRate, remainCost) {
                if (countedPeriod > period) {
                    return Common.round(excelComplaint, depr);
                }
                else {
                    var countedPeriod = countedPeriod + 1;
                    var calcT         = assetLife - countedPeriod;

                    var deprTemp = Common.areEqual(calcT, 2) ? (remainCost * 0.5) : (deprRate * remainCost);
                    var deprRate = Common.areEqual(calcT, 2) ? 1 : deprRate;

                    var depr = null;
                    if (remainCost < salvage) {
                        depr = (remainCost - salvage < 0) ? 0 : remainCost - salvage;
                    } else {
                        return deprTemp;
                    }
                    var remainCost = remainCost - depr;

                    return findDepr(countedPeriod, depr, deprRate, remainCost);
                }
            };

            if (period === 0) {
                return firstDepr;
            }
            else {
                return findDepr(1, 0, deprR, cost - firstDepr);
            }
        }
    };


    // Function Implementations

    scope.DB = function(cost, salvage, life, period, month) {
        // Month is optional, default to 12
        if (month === null || month === undefined) {
            month = 12;
        }

        // Check if the arguments are of correct type
        if (typeof cost !== "number" || typeof salvage !== "number" || typeof life !== "number" ||
            typeof period !== "number" || typeof month !== "number") {
            return '#VALUE!';
        }

        if (cost < 0 || salvage < 0 || life <= 0 || month <= 0 || period <= 0) {
            return '#NUM!';
        }

        // Months must be <= 12
        if (month > 12) {
            return '#NUM!';
        }

        return db(cost, salvage, life, period, month);
    };

    scope.SLN = function(cost, salvage, life) {
        // Check argument type
        if (typeof cost !== "number" || typeof salvage !== "number" || typeof life !== "number") {
            return '#VALUE';
        }

        if (cost < 0 || salvage < 0 || life <= 0) {
            return '#NUM!';
        }

        return sln(cost, salvage, life);
    };

    scope.SYD = function(cost, salvage, life, per) {
        // Check argument types
        if (typeof cost !== "number" || typeof salvage !== "number" || typeof life !== "number" || typeof per !== "number") {
            return '#VALUE!';
        }

        if (cost < 0 || salvage < 0 || life <= 0 || per <= 0) {
            return '#NUM!';
        }

        //( period <= life )  |> elseThrow "Period must be less than life"

        return syd(cost, salvage, life, per);
    };

    scope.DDB = function(cost, salvage, life, period, factor) {
        // Check optional args
        if (factor === null || factor === undefined) {
            factor = 2;
        }

        // Check if the arguments are of correct type
        if (typeof cost !== "number" || typeof salvage !== "number" || typeof life !== "number" ||
            typeof period !== "number" || typeof factor !== "number") {
            return '#VALUE!';
        }

        if (cost < 0 || salvage < 0 || life <= 0 || factor <= 0 || period <= 0) {
            return '#NUM!';
        }

        // ( period <= life )  |> elseThrow "Period must be less than life"

        if (period === 0) {
            return Math.min(cost * (factor / life), cost - salvage);
        } else {
            return ddb(cost, salvage, life, period, factor);
        }
    };

    scope.VDB = function(cost, salvage, life, startPeriod, endPeriod, factor, bflag) {
        // Check optional arguments
        if (factor === null || factor === undefined) {
            factor = 2;
        }
        if (bflag === null || bflag === undefined) {
            bflag = false;
        }

        // Check argument types
        if (typeof cost !== "number" || typeof salvage !== "number" || typeof life !== "number" ||
            typeof startPeriod !== "number" || typeof endPeriod !== "number" || typeof factor !== "number" ||
            typeof bflag !== "boolean") {
            return '#VALUE!';
        }

        if (cost < 0 || salvage < 0 || life <= 0 || factor <= 0 || endPeriod <= 0) {
            return '#NUM!';
        }

        // ( startPeriod <= life )     |> elseThrow "StartPeriod must be less than life"
        // ( endPeriod <= life )       |> elseThrow "EndPeriod must be less than life"
        // ( startPeriod <= endPeriod )|> elseThrow "StartPeriod must be less than endPeriod"

        // ( bflag = VdbSwitch.DontSwitchToStraightLine || not(life = startPeriod && startPeriod = endPeriod) ) |> elseThrow "If bflag is set to SwitchToStraightLine, then life, startPeriod and endPeriod cannot all have the same value"

        return vdb(cost, salvage, life, startPeriod, endPeriod, factor, bflag);
    };

    scope.AMORLINC = function(cost, datePurchased, firstPeriod, salvage, period, rate, basis) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof cost !== "number" || typeof salvage !== "number" || typeof period !== "number" ||
            typeof rate !== "number" || typeof basis !== "number") {
            return '#VALUE';
        }

        // Check if dates are valid
        if (!moment(datePurchased).isValid() || !moment(firstPeriod).isValid()) {
            return '#VALUE!';
        }

        if (cost < 0 || salvage < 0 || period < 0 || rate < 0) {
            return '#NUM';
        }

        if (basis === 2) {
            return '#NUM';
        }

        //( salvage < cost )                  |> elseThrow "Salvage must be less than cost"
        //(datePurchased < firstPeriod)       |> elseThrow "DatePurchased must be less than FirstPeriod"

        datePurchased = moment(datePurchased);
        firstPeriod   = moment(firstPeriod);

        return amorlinc(cost, datePurchased, firstPeriod, salvage, period, rate, basis);
    };

    scope.AMORDEGRC = function(cost, datePurchased, firstPeriod, salvage, period, rate, basis, excelComplaint) {
        // Check optional params
        if (basis === null || basis === undefined) {
            basis = 0;
        }

        // Check argument types
        if (typeof cost !== "number" || typeof salvage !== "number" || typeof period !== "number" ||
            typeof rate !== "number" || typeof basis !== "number") {
            return '#VALUE';
        }

        // Check if dates are valid
        if (!moment(datePurchased).isValid() || !moment(firstPeriod).isValid()) {
            return '#VALUE!';
        }

        if (cost < 0 || salvage < 0 || period < 0 || rate < 0) {
            return '#NUM';
        }

        if (basis === 2) {
            return '#NUM';
        }

        // Validation
        // let assetLife = 1. / rate
        // let between x1 x2 = assetLife >= x1 && assetLife <= x2
        // ( not(between 0. 3.) )              |> elseThrow "Assset life cannot be between 0 and 3"
        // ( not(between 4. 5.) )              |> elseThrow "Assset life cannot be between 4. and 5."

        // ( salvage < cost )                  |> elseThrow "Salvage must be less than cost"
        // (datePurchased < firstPeriod)       |> elseThrow "DatePurchased must be less than FirstPeriod"

        datePurchased = moment(datePurchased);
        firstPeriod   = moment(firstPeriod);

        return amordegrc(cost, datePurchased, firstPeriod, salvage, period, rate, basis, excelComplaint);
    };

    return scope;

});