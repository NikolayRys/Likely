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
export default (value) => {
    const listeners = [];

    return (argument) => {
        const type = typeof argument;

        if (type === 'undefined') {
            return value;
        }
        else if (type === 'function') {
            listeners.push(argument);
        }
        else {
            value = argument;

            listeners.forEach((listener) => {
                listener(argument);
            });
        }
    };
};
