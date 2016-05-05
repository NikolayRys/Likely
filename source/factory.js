'use strict';

/* eslint-disable consistent-return, no-param-reassign */

/**
 * Factory function
 *
 * This function returns function with following API:
 *
 * - if passed argument is callback, then this callback would be called
 *   if the value was changed
 * - if passed argument is anything but undefined or function, then this
 *   function behaves like setter
 * - if argument isn't provided, then return value stored in closure
 *
 * @param {Object} value
 * @returns {Function}
 */
module.exports = function (value) {
    var listeners = [];

    return function (argument) {
        var type = typeof argument;

        if (type === 'undefined') {
            return value;
        }
        else if (type === 'function') {
            listeners.push(argument);
        }
        else {
            value = argument;

            listeners.forEach(function (listener) {
                listener(argument);
            });
        }
    };
};
