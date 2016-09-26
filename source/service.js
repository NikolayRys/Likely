'use strict';

var dom = require('./dom');

/**
 * @param {String} url
 * @param {Function} factory
 */
var counter = function (url, factory) {
    var self = this;

    dom.getJSON(url, function (count) {
        try {
            var convertedNumber = typeof self.convertNumber === 'function' ? self.convertNumber(count) : count;
            factory(convertedNumber);
        }
        catch (e) {}
    });
};

/**
 * @param {Object} options
 */
module.exports = function (options) {
    // __likelyCounterMock is used for UI testing and is set on window
    // because this function is executed right when Likely is loaded.
    // There’s currently no way to do `likely.__counterMock = ...`
    // before running this method.
    options.counter = window.__likelyCounterMock || options.counter || counter;
    options.click = options.click || function () {
        return true;
    };
};
