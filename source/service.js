import { getJSON } from './dom';

/**
 * @param {String} url
 * @param {Function} factory
 */
const counter = function (url, factory) {
    getJSON(url, (count) => {
        try {
            const convertedNumber = typeof this.convertNumber === 'function' ? this.convertNumber(count) : count;
            factory(convertedNumber);
        }
        catch (e) {}
    });
};

/**
 * @param {Object} options
 */
export default (options) => {
    // __likelyCounterMock is used for UI testing and is set on window
    // because this function is executed right when Likely is loaded.
    // There’s currently no way to do `likely.__counterMock = ...`
    // before running this method.
    options.counter = window.__likelyCounterMock || options.counter || counter;
    options.click = options.click || (() => true);
};
