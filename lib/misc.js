(function (definition) {
    if (typeof exports === "object") {
        var moment = require("moment");
        var Common = require("../lib/common.js");

        module.exports = definition(moment, Common);
    } else if (typeof define === "function" && define.amd) {
        define(['moment', 'common'], definition);
    }
})( function(moment, Common) {

    var scope = this.Misc = {};

    var dollar = function(fractionalDollar, fraction, f) {
        var aBase     = Math.floor(fraction);
        var dollar    = (fractionalDollar > 0) ? Math.floor(fractionalDollar) : Math.ceil(fractionalDollar);
        var remainder = fractionalDollar - dollar;
        var digits    = Math.pow(10, Math.ceil(Common.log10(aBase)));

        return f(aBase, dollar, remainder, digits);
    };

    var dollarDe = function(aBase, dollar, remainder, digits) {
        return remainder * digits /  aBase + dollar;
    };

    var dollarFr = function(aBase, dollar, remainder, digits) {
        var absDigits = Math.abs(digits);
        return remainder *  aBase / absDigits + dollar;
    };

    var effect = function(nominalRate, npery) {
        var periods = Math.floor(npery);
        return Math.pow( nominalRate / periods + 1, periods) - 1;
    };

    var nominal = function(effectRate, npery) {
        var periods = Math.floor(npery);
        return (Math.pow(effectRate + 1, 1 / periods) - 1) * periods;
    };

    scope.DOLLARDE = function(fractionalDollar, fraction) {
        // Truncate fraction
        fraction = Math.floor(fraction);

        if (fraction < 0) {
            return '#NUM!';
        }

        if (fraction === 0) {
            return '#DIV/0!';
        }

        return dollar(fractionalDollar, fraction, dollarDe);
    };

    scope.DOLLARFR = function(fractionalDollar, fraction) {
        // Truncate fraction
        fraction = Math.floor(fraction);

        if (fraction < 0) {
            return '#NUM!';
        }

        if (fraction === 0) {
            return '#DIV/0!';
        }
        // (pow 10. (ceiling (log10 (floor fraction))) <> 0.) |> elseThrow "10^(ceiling (log10 (floor fraction))) must be different from 0"

        return dollar(fractionalDollar, fraction, dollarFr);
    };

    scope.EFFECT = function(nominalRate, npery) {
        if (typeof nominalRate !== "number" || typeof npery !== "number") {
            return '#VALUE!';
        }

        // Truncate npery
        npery = Math.floor(npery);

        if (nominalRate <= 0 || npery < 1) {
            return '#NUM!';
        }

        return effect(nominalRate, npery);
    };

    scope.NOMINAL = function(effectRate, npery) {
        if (typeof effectRate !== "number" || typeof npery !== "number") {
            return '#VALUE!';
        }

        // Truncate npery
        npery = Math.floor(npery);

        if (effectRate <= 0 || npery < 1) {
            return '#NUM!';
        }

        return nominal(effectRate, npery);
    };

    return scope;

});