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
    options.counter = options.counter || counter;
    options.click = options.click || function () {
        return true;
    };
};
