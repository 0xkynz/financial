(function (definition) {
    if (typeof exports === "object") {
        var moment   = require("moment");

        module.exports = definition(moment);
    } else if (typeof define === "function" && define.amd) {
        define(['moment'], definition);
    }
})(function (moment) {

    var scope = this.Common = {};

    scope.isLastDayOfMonth = function(date) {
        var lastDay = scope.lastDayOfMonth(date);
        return (lastDay === date.date());
    };

    scope.lastDayOfMonth = function(date) {
        return date.daysInMonth();
    };

    scope.isLastDayOfFebruary = function(date) {
        var m = date.month();
        return (m === 2 && scope.isLastDayOfMonth(date));
    };

    var AccrIntCalcMethod                   = {};
    AccrIntCalcMethod.FromFirstToSettlement = 0;
    AccrIntCalcMethod.FromIssueToSettlement = 1;
    scope.AccrIntCalcMethod                 = AccrIntCalcMethod;

    var VdbSwitch                      = {};
    VdbSwitch.DontSwitchToStraightLine = 1;
    VdbSwitch.SwitchToStraightLine     = 0;
    scope.VdbSwitch                    = VdbSwitch;

    var PaymentDue               = {}
    PaymentDue.EndOfPeriod       = 0
    PaymentDue.BeginningOfPeriod = 1
    scope.PaymentDue             = PaymentDue;

    /////////////////////////////////////////////////

    scope.rest = function(x) {
        return x - Math.floor(x);
    };

    scope.round = function(excelComplaint, x) {
        if (excelComplaint) {
            var k = x.toFixed(13);
            var k1 = parseFloat(k);
            return Math.round(k1);
        } else {
            return Math.round(x);
        }
    };

    var precision = 0.0001;

    scope.areEqual = function(x, y) {
        if (Math.abs(x - y) < precision) {
            return true;
        }
        else {
            return false;
        }
    };

    scope.log10 = function(val) {
        return Math.log(val) / Math.LN10;
    };

    // Implementation of F# fold function
    var fold = function(f, state, source) {
        var index      = 0;
        var length     = source.length;
        var value      = state;
        var isValueSet = true;

        for (; length > index; index++) {
            value = f(value, source[index], index, source);
        }
        return value;
    };

    scope.map = function(f, array) {
        var result = [];
        var len    = array.length;

        for (var index = 0; index < len; index++) {
            var val = f(array[index]);
            result.push(val);
        }
        return result;
    };

    scope.mapi = function(f, array) {
        var result = [];
        var len    = array.length;

        for (var index = 0; index < len; index++) {
            var val = f(index, array[index]);
            result.push(val);
        }
        return result;
    };

    scope.map2 = function(f, array1, array2) {
        var result = [];
        var len1 = array1.length;
        var len2 = array2.length;

        var len = (len1 >= len2 ? len2 : len1);

        for (var index = 0; index < len; index++) {
            var val = f(array1[index], array2[index]);
            result.push(val);
        }
        return result;
    };

    // Check if an array has all valid dates
    scope.allValidDates = function(array) {
        for (var i = 0; i < array.length; i++) {
            if (!moment(array[i]).isValid()) {
                return false;
            }
        }
        return true;
    };

    // Check if an array has all valid numbers
    scope.allValidNumbers = function(array) {
        for (var i = 0; i < array.length; i++) {
            if (typeof array[i] !== "number" && array[i] !== null) {
                return false;
            }
        }
        return true;
    };

    // Checking to see if b ^ p is valid. Only invalid
    // If b is negative AND p is a decimal (ie. sqrt(-2) = -2 ^.5 == invalid)
    scope.raisable = function(b, p) {
        return !( (1 + b) < 0 && (p % 1 !== 0));
    };

    scope.idem = function(x) {
        return x;
    }

    scope.sumBy = function(f, array) {
        var sumList = scope.map(f, array);
        var sum     = 0;

        for (var index = 0; index < sumList.length; index++) {
            sum = sum + sumList[index];
        }
        return sum;
    };

    scope.aggrBetween = function(startPeriod, endPeriod, f, initialValue) {
        var s = [];
        if (startPeriod <= endPeriod) {
            for (var i = startPeriod; i <= endPeriod; i++) {
                s.push(i);
            }
        } else {
            for (var i = startPeriod; i >= endPeriod; i--) {
                s.push(i);
            }
        }
        return fold(f, initialValue, s);
    };

    var findBounds = function(f, guess, minBound, maxBound, precision) {
        if (guess <= minBound || guess >= maxBound) {
            return null; // ? throw exception?
        }

        var shift    = 0.01;
        var factor   = 1.6;
        var maxTries = 60;

        var adjValueToMin = function(value) {
            return (value <= minBound ? minBound + precision : value);
        };

        var adjValueToMax = function(value) {
            return (value >= maxBound ? maxBound - precision : value);
        };

        var rfindBounds = function(low, up, tries) {
            tries = tries - 1;

            if (tries === 0) {
                //then throw (sprintf "Not found an interval comprising the root after %i tries, last tried was (%f, %f)" maxTries low up)
                return null; // ?
            }

            var lower = adjValueToMin(low);
            var upper = adjValueToMax(up);

            var x = f(lower);
            var y = f(upper);

            if (x*y === 0) {
                return [lower, upper];
            }
            if (x*y < 0) {
                return [lower, upper];
            }
            if (x*y > 0) {
                return rfindBounds(lower + factor * (lower - upper), upper + factor * (upper - lower), tries);
            }
        };

        var low  = adjValueToMin(guess - shift);
        var high = adjValueToMax(guess + shift);

        return rfindBounds(low, high, maxTries);
    };

    var bisection = function(f1, a1, b1, count1, precision1) {
        var maxCount = 200;

        var helper = function(f, a, b, count, precision) {
            if (a === b) {
                return null; // ?
            }

            var fa = f(a);

            if (Math.abs(fa) < precision) {
                return a;
            } else {
                var fb = f(b);

                if (Math.abs(fb) < precision) {
                    return b;
                }
                else {
                    var newCount = count + 1;

                    if (newCount > maxCount) {
                        return null; // ?
                    }

                    if (fa * fb > 0) {
                        return null; // ?
                    }

                    var midvalue = a + 0.5 * (b - a);
                    var fmid = f(midvalue);

                    if (Math.abs(fmid) < precision) {
                        return midvalue;                // the midvalue is the root
                    } else if ( fa * fmid < 0) {
                        return helper(f, a, midvalue, newCount, precision);
                    } else if ( fa * fmid > 0)  {
                        return helper(f, midvalue, b, newCount, precision);
                    } else {
                        return null;    // ?
                    }
                }
            }
        };

        return helper(f1, a1, b1, count1, precision1);
    };

    var newton = function(f1, x1, count1, precision1) {
        var maxCount = 20;

        var helper = function(f, x, count, precision) {

            var d = function(f, x) {
                return (f(x + precision) - f(x - precision)) / (2 * precision);
            };

            var fx   = f(x);
            var Fx   = d(f, x);
            var newX = x - (fx/Fx);

            if (Math.abs(newX - x) < precision) {
                return newX;
            } else if (count > maxCount) {
                return null;
            } else {
                return helper(f, newX, count+1, precision);
            }
        };

        return helper(f1, x1, count1, precision1);
    }

    scope.findRoot = function(f, guess) {
        var precision = 0.0000001; // Excel precision on this, from docs
        var newtValue = newton(f, guess, 0, precision);

        var sameSign = function(n1, n2) {
            return ( (n1*n2) > 0);
        }

        // Not sure the meaning here of newtValue.isSome and newtValue.value
        if (newtValue != null && sameSign(guess, newtValue)) {
            return newtValue;
        } else {
            var bounds = findBounds(f, guess, -1, Number.MAX_VALUE , precision);
            var lower = bounds[0];
            var upper = bounds[1];

            return bisection(f, lower, upper, 0, precision);
        }
    };

    return scope;

});