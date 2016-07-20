import dom from './dom';

/**
 * @param {String} url
 * @param {Function} factory
 */
const counter = function (url, factory) {
    dom.getJSON(url, count => {
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
export default options => {
    options.counter = options.counter || counter;
    options.click = options.click || (() => true);
};
