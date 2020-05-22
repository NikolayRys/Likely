import { getJSON, global } from './dom';

/**
 * @param {String} url
 * @param {Function} updateBroadcaster
 */
const defaultFetch = function (updateBroadcaster) {
    getJSON(updateBroadcaster.url, (count) => {
        try {
            const convertedNumber = typeof this.convertNumber === 'function' ? this.convertNumber(count) : count;
            updateBroadcaster.trigger(convertedNumber);
        }
        catch (e) {}
    });
};

/**
 * @param {Object} options
 */
export default (options) => {
    // __likelyFetchMock is used for UI testing and is set on window
    // because this function is executed right when Likely is loaded.
    // There’s currently no way to do `likely.__likelyFetchMock = ...`
    // before running this method.
    options.fetch = global.__likelyFetchMock || options.fetch || defaultFetch;
    options.click = options.click || (() => true);
};
