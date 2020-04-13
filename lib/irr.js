
(function (definition) {
    if (typeof exports === "object") {
        var moment = require("moment");
        var Common = require("../lib/common.js");
        var Tvm    = require("../lib/tvm.js");

        module.exports = definition(moment, Common, Tvm);
    } else if (typeof define === "function" && define.amd) {
        define(['moment', 'common', 'tvm'], definition);
    }
})( function(moment, Common, Tvm) {

    var scope = this.Irr = {};

    var pvFactor = Tvm.pvFactor;

    var npv = function(r, cfs) {

        var f = function(i, cf) {
            return cf * pvFactor(r, i+1);
        };

        //cfs |> Seq.mapi f |> Seq.sumBy idem

        return Common.sumBy(Common.idem, Common.mapi(f, cfs));
    };

    var irr = function(cfs, guess) {
        var f = function(r) {
            return npv(r, cfs);
        };

        return Common.findRoot(f, guess);
    };

    var mirr = function(cfs, financeRate, reinvestRate) {
        var n = cfs.length;

        var fp = function(cf) {
            return (cf > 0 ? cf : 0);
        };

        var fn = function(cf) {
            return (cf < 0 ? cf : 0);
        };

        var positives = Common.map(fp, cfs);
        var negatives = Common.map(fn, cfs);

        var num   = - npv(reinvestRate, positives) * Math.pow(1 + reinvestRate, n);
        var denom = npv(financeRate, negatives) * (1 + financeRate);

        return (Math.pow(num/denom, 1/(n-1)) - 1);
    };

    var xnpv = function(r, cfs, dates) {
        var d0 = dates[0];

        var f = function(d, cf) {
            var diff = d.diff(d0, 'days');
            return cf / (Math.pow(1 + r, diff/ 365));
        };

        //fun d cf -> cf / ((1. + r) ** (float (days d d0) / 365.))
        // cfs |> Seq.map2 f dates |> Seq.sumBy idem

        return Common.sumBy(Common.idem, Common.map2(f, dates, cfs));
    };

    var xirr = function(cfs, dates, guess) {
        var f = function(r) {
            return xnpv(r, cfs, dates);
        };

        return Common.findRoot(f, guess);
    };

    var validCfs = function(cfs) {

        var _validCfs = function(cfs, pos, neg) {
            if (pos === true && neg === true) {
                return true;
            } else {
                if (cfs.length === 0) {
                    return false;
                } else {
                    var h = cfs[0];
                    var t = cfs.slice(1, cfs.length);
                    if (h > 0) {
                        return _validCfs(t, true, neg);
                    } else {
                        return _validCfs(t, pos, true);
                    }
                }
            }
        };

        return _validCfs(cfs, false, false);
    }


    // Function Implementations

    scope.IRR = function(cfs, guess) {
        // Check optional params
        if (guess === null || guess === undefined) {
            guess = 0.1;
        }

        // Check argument types
        if (typeof guess !== "number") {
            return '#VALUE!';
        }

        if (!validCfs(cfs)) {
            return '#NUM!';
        }

        return irr(cfs, guess);
    };

    scope.NPV = function(r, cfs) {
        // Check argument types
        if (typeof r !== "number") {
            return '#VALUE!';
        }

        if (r === -1) {
            return '#NUM!';
        }

        return npv(r, cfs);
    };

    scope.MIRR = function(cfs, financeRate, reinvestRate) {
        // Check argument types
        if (typeof financeRate !== "number" || typeof reinvestRate !== "number") {
            return '#VALUE!';
        }

        if (financeRate === -1 || reinvestRate === -1) {
            return '#NUM!';
        }

        if (cfs.length <= 1) {
            return '#NUM!';
        }

        // ( (npv financeRate (cfs |> Seq.map (fun cf -> if cf < 0. then cf else 0.)))  <> 0. ) |> elseThrow "The NPV calculated using financeRate and the negative cashflows in cfs must be different from zero"

        return mirr(cfs, financeRate, reinvestRate);
    };

    scope.XNPV = function(r, cfs, dates) {
        // Check argument types
        if (typeof r !== "number") {
            return '#VALUE!';
        }

        if (cfs.length !== dates.length) {
            return '#NUM!';
        }

        dates = Common.map(function(d){
            return moment(d);
        }, dates);

        if (r === -1) {
            return '#NUM!';
        }

        return xnpv(r, cfs, dates);
    };

    scope.XIRR = function(cfs, dates, guess) {
        // Optional params
        if (guess === null || guess === undefined) {
            guess = .1;
        }

        // Check argument types
        if (typeof guess !== "number") {
            return '#VALUE!';
        }

        if (!validCfs(cfs)) {
            return '#NUM!';
        }

        if (cfs.length !== dates.length) {
            return '#NUM!';
        }

        dates = Common.map(function(d){
            return moment(d);
        }, dates);

        return xirr(cfs, dates, guess);
    };

    return scope;

});