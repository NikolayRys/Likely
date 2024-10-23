import { interpolateUrl } from './utils';

/**
 * Class for preventing duplicated requests from the similar buttons, which encapsulates:
 *  1. Callbacks for all buttons that share the same value.
 *  2. Prepared service counter URL.
 *  3. Value, returned from this URL
 * @param {string} counterUrl
 * @param {string} pageUrl
 */
function UpdateBroadcaster(counterUrl, pageUrl) {
    this.url = interpolateUrl(counterUrl, { url: pageUrl });
    this.setters = [];
    this.value = undefined;
}

/**
 * Connects new related button with its callback.
 * @param {Function} buttonSetterFn
 */
UpdateBroadcaster.prototype.register = function (buttonSetterFn) {
    this.setters.push(buttonSetterFn);
    if (this.value) {
        buttonSetterFn(this.value);
    }
};

/**
 * Distributes obtained value to all buttons that share it
 * @param {Integer} value
 */
UpdateBroadcaster.prototype.trigger = function (value) {
    this.value = value;
    this.setters.forEach((buttonSetter) => {
        buttonSetter(value);
    });
};

/**
 * Find or create an appropriate instance of UpdateBroadcaster
 * @param {Function} buttonSetterFn
 * @param {object} options
 */
export default (buttonSetterFn, options) => {
    let broadcaster = options.service.broadcastersByUrl[options.url];
    if (!broadcaster) {
        broadcaster = new UpdateBroadcaster(options.service.counterUrl, options.url);
        options.service.broadcastersByUrl[options.url] = broadcaster;
        options.service.fetch(broadcaster);
    }
    broadcaster.register(buttonSetterFn);
};
