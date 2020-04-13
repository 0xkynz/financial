(function (definition) {
    if (typeof exports === "object") {
        var moment = require("moment");
        var Common = require("../lib/common.js");

        module.exports = definition(moment, Common);
    } else if (typeof define === "function" && define.amd) {
        define(['moment', 'common'], definition);
    }
})( function(moment, Common) {

    var scope = this.Tvm = {};

    var fvFactor = function(r, nper) {
        return Math.pow(1 + r, nper);
    };

    scope.fvFactor = fvFactor;

    var pvFactor = function(r, nper) {
        return (1 / fvFactor(r, nper));
    };

    scope.pvFactor = pvFactor;

    var annuityCertainPvFactor = function(r, nper, pd) {
        if (r === 0) {
            return nper;
        }
        else {
            return (1 + r * pd) * (1 - pvFactor(r, nper)) / r;
        }
    };

    scope.annuityCertainPvFactor = annuityCertainPvFactor;

    var annuityCertainFvFactor = function(r, nper, pd) {
        return annuityCertainPvFactor(r, nper, pd ) * fvFactor(r, nper);
    };

    var nperFactor = function(r, pmt, v, pd) {
        return v * r + pmt * ( 1 + r * pd );
    };

    var pv = function(r, nper, pmt, fv, pd) {
        return -(fv * pvFactor(r, nper) + pmt * annuityCertainPvFactor(r, nper, pd));
    };

    var fv = function(r, nper, pmt, pv, pd) {
        return -(pv * fvFactor(r, nper) + pmt * annuityCertainFvFactor(r, nper, pd));
    };

    var pmt = function(r, nper, pv, fv, pd) {
        return -(pv + fv * pvFactor(r, nper)) / annuityCertainPvFactor(r, nper, pd);
    };

    scope.pmt = pmt;

    var nper = function(r, pmt, pv, fv, pd) {
        return Math.log(nperFactor(r, pmt, -fv, pd) / nperFactor(r, pmt, pv, pd)) / Math.log(r+1);
    };

    scope.PV = function(r, nper, pmt, fv, pd) {
        // Check for optional parameters
        if (fv === null || fv === undefined) {
            fv = 0;
        }

        if (pd === null || pd === undefined) {
            pd = 0;
        }

        if (Common.raisable(r, nper) === false) {
            return '#NUM!';
        }

        if (pmt === 0 && fv === 0) {
            return '#NUM!';
        }

        if (r === -1) {
            return '#NUM!';
        }

        return pv(r, nper, pmt, fv, pd);
    };

    scope.FV = function(r, nper, pmt, pv, pd) {
        // Check for optional parameters
        if (pv === null || pv === undefined) {
            pv = 0;
        }

        if (pd === null || pd === undefined) {
            pd = 0;
        }

        if (Common.raisable(r, nper) === false) {
            return '#NUM!';
        }

        if (r === -1 && nper <= 0) {
            return '#NUM!';
        }

        if (pmt === 0 && pv === 0) {
            return '#NUM!';
        }

        if (r === -1 && pd === Common.PaymentDue.BeginningOfPeriod) {
            return -(pv * fvFactor(r, nper));
        }
        else if (r === -1 && pd === Common.PaymentDue.EndOfPeriod) {
            return -(pv * fvFactor(r, nper) + pmt);
        }
        else {
            return fv(r, nper, pmt, pv, pd);
        }
    };

    scope.PMT = function(r, nper, pv, fv, pd) {
        // Check for optional parameters
        if (fv === null || fv === undefined) {
            fv = 0;
        }

        if (pd === null || pd === undefined) {
            pd = 0;
        }

        if (Common.raisable(r, nper) === false) {
            return '#NUM!';
        }

        if (fv === 0 && pv === 0) {
            return '#NUM!';
        }

        if (r === -1 && nper <= 0 && pd === Common.PaymentDue.EndOfPeriod) {
            return '#NUM!';
        }

        if (annuityCertainPvFactor(r,nper,pd) === 0) {
            return 'NUM!';
        }

        if (r === -1) {
            return -fv;
        }
        else {
            return pmt(r, nper, pv, fv, pd);
        }
    };

    scope.NPER = function(r, pmt, pv, fv, pd) {
        // Check for optional parameters
        if (fv === null || fv === undefined) {
            fv = 0;
        }

        if (pd === null || pd === undefined) {
            pd = 0;
        }

        if (r === 0 && pmt !== 0) {
            return -(fv + pv) / pmt;
        }
        else {
            return nper(r, pmt, pv, fv, pd);
        }
    };

    scope.RATE = function(nper, pmt, pv, fv, pd, guess) {
        if (fv === null || fv === undefined) {
            fv = 0;
        }

        if (pd === null || pd === undefined) {
            pd = 0;
        }

        if (guess === null || guess === undefined) {
            guess = .1;
        }

        if (pmt === 0 && pv === 0) {
            return '#NUM!';
        }

        if (nper <= 0) {
            return '#NUM!';
        }

        // let haveRightSigns x y z =
        //     not( sign x = sign y && sign y = sign z) &&
        //     not (sign x = sign y && z = 0.) &&
        //     not (sign x = sign z && y = 0.) &&
        //     not (sign y = sign z && x = 0.)
        //
        // ( haveRightSigns pmt pv fv )                |> elseThrow "There must be at least a change in sign in pv, fv and pmt"

        if (fv === 0 && pv === 0) {
            return (pmt < 0 ? -1 : 1);
        }
        else {
            var f = function(r) {
                return scope.FV(r, nper, pmt, pv, pd)-fv;
            };
            return Common.findRoot(f, guess);
        }
    };

    scope.FVSCHEDULE = function(pv, interests) {
        if (typeof pv !== "number") {
            return '#VALUE!';
        }

        if (Common.allValidNumbers(interests) === false) {
            return '#VALUE!';
        }

        var result = pv;
        for (var i = 0; i < interests.length; i++) {
            result = result * (1 + interests[i]);
        }
        return result;
    };

    return scope;

});