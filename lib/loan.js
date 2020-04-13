
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

    var scope = this.Loan = {};

    var pmt                    = Tvm.pmt;
    var fvFactor               = Tvm.fvFactor;
    var annuityCertainPvFactor = Tvm.annuityCertainPvFactor;

    var ipmt = function(r, per, nper, pv, fv, pd) {
        var result = -( pv * fvFactor(r, per - 1) * r + pmt(r, nper, pv, fv, Common.PaymentDue.EndOfPeriod) * (fvFactor(r, per - 1) - 1) );
        if (pd === Common.PaymentDue.EndOfPeriod) {
            return result;
        } else {
            return result / (1 + r);
        }
    };

    var ppmt = function(r, per, nper, pv, fv, pd) {
        return pmt(r, nper, pv, fv, pd) - ipmt(r, per, nper, pv, fv, pd);
    };

    var ispmt = function(r, per, nper, pv) {
        var coupon = -pv * r;
        return coupon - (coupon / nper * per);
    };

    scope.IPMT = function(r, per, nper, pv, fv, pd) {
        // Optional params
        if (fv === null || fv === undefined) {
            fv = 0;
        }
        if (pd === null || pd === undefined) {
            pd = 0;
        }

        if (!Common.raisable(r, nper)) {
            return '#NUM!';
        }

        if (!Common.raisable(r, per-1)) {
            return '#NUM!';
        }

        if (fv === 0 && pv === 0) {
            return '#NUM!';
        }

        if (r === -1 && nper <= 0 && per <= 0 && pd !== Common.PaymentDue.EndOfPeriod) {
            return '#NUM!';
        }

        if (annuityCertainPvFactor(r,nper,pd) === 0) {
            return '#NUM!';
        }

        if (per < 1 || per > nper) {
            return '#NUM!';
        }

        if (nper <= 0) {
            return '#NUM!';
        }

        if (per === 1 && pd === Common.PaymentDue.BeginningOfPeriod) {
            return 0;
        }
        else if (r === -1) {
            return -fv;
        }
        else {
            return ipmt(r, per, nper, pv, fv, pd);
        }
    };

    scope.PPMT = function(r, per, nper, pv, fv, pd) {

        if (fv === null || fv === undefined) {
            fv = 0;
        }
        if (pd === null || pd === undefined) {
            pd = 0;
        }

        if (!Common.raisable(r, nper)) {
            return '#NUM!';
        }

        if (!Common.raisable(r, per-1)) {
            return '#NUM!';
        }

        if (fv === 0 && pv === 0) {
            return '#NUM!';
        }

        if (r === -1 && nper <= 0 && per <= 0 && pd !== Common.PaymentDue.EndOfPeriod) {
            return '#NUM!';
        }

        if (annuityCertainPvFactor(r,nper,pd) === 0) {
            return '#NUM!';
        }

        if (per < 1 || per > nper) {
            return '#NUM!';
        }

        if (nper <= 0) {
            return '#NUM!';
        }

        if (per === 1 && pd === Common.PaymentDue.BeginningOfPeriod) {
            return pmt(r, nper, pv, fv, pd);
        }
        else if (r === -1) {
            return 0;
        }
        else {
            return ppmt(r, per, nper, pv, fv, pd);
        }
    };

    scope.CUMIPMT = function(r, nper, pv, startPeriod, endPeriod, pd) {

        if (!Common.raisable(r, nper)) {
            return '#NUM!';
        }

        if (!Common.raisable(r, startPeriod-1)) {
            return '#NUM!';
        }

        if (pv <= 0 || r <= 0 || nper <= 0) {
            return '#NUM!';
        }

        if (startPeriod < 1 || endPeriod < 1 || startPeriod > endPeriod) {
            return '#NUM!';
        }

        if (pd !== 0 && pd !== 1) {
            return '#NUM!';
        }

        if (annuityCertainPvFactor(r, nper, pd) === 0) {
            return '#NUM!';
        }

        if (endPeriod > nper) {
            return '#NUM!';
        }

        var f = function(acc, per) {
            return acc + scope.IPMT(r, per, nper, pv, 0, pd);
        };

        return Common.aggrBetween(Math.ceil(startPeriod), endPeriod, f, 0);
    };

    scope.CUMPRINC = function(r, nper, pv, startPeriod, endPeriod, pd) {

        if (!Common.raisable(r, nper)) {
            return '#NUM!';
        }

        if (!Common.raisable(r, startPeriod-1)) {
            return '#NUM!';
        }

        if (pv <= 0 || r <= 0 || nper <= 0) {
            return '#NUM!';
        }

        if (startPeriod < 1 || endPeriod < 1 || startPeriod > endPeriod) {
            return '#NUM!';
        }

        if (pd !== 0 && pd !== 1) {
            return '#NUM!';
        }

        if (annuityCertainPvFactor(r, nper, pd) === 0) {
            return '#NUM!';
        }

        if (endPeriod > nper) {
            return '#NUM!';
        }

        var f = function(acc, per) {
            return acc + scope.PPMT(r, per, nper, pv, 0, pd);
        };

        return Common.aggrBetween(Math.ceil(startPeriod), endPeriod, f, 0);
    };

    scope.ISPMT = function(r, per, nper, pv) {

        if (per < 1 || per > nper) {
            return '#NUM!';
        }

        if (nper <= 0) {
            return '#NUM!';
        }

        return ispmt(r, per, nper, pv);
    };

    return scope;

});