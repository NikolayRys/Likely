import { interpolateUrl } from './utils';
import services from './services';

const broadcastersForServices = {};

function UpdateBroadcaster(counterUrl, pageUrl) {
    this.url = interpolateUrl(counterUrl, { url: pageUrl });
    this.setters = [];
    this.cachedValue = undefined;
}

UpdateBroadcaster.prototype.fetchFromService = function (serviceName) {
    services[serviceName].fetch(this);
};

UpdateBroadcaster.prototype.register = function (buttonSetter) {
    this.setters.push(buttonSetter);
    if (this.cachedValue) {
        buttonSetter(this.cachedValue);
    }
};

UpdateBroadcaster.prototype.trigger = function (value) {
    this.cachedValue = value;
    this.setters.forEach((buttonSetter) => {
        buttonSetter(value);
    });
};

/**
 * Find or create an appropriate instance of UpdateBroadcaster
 *
 * @param {String} serviceName
 * @param {Object} options
 * @param {Function} buttonSetter
 */

export default (serviceName, buttonSetter, options) => {
    if (!broadcastersForServices[serviceName]) {
        broadcastersForServices[serviceName] = {};
    }
    const broadcastersForUrls = broadcastersForServices[serviceName];
    let broadcaster = broadcastersForUrls[options.url];

    if (!broadcaster || options.forceUpdate) {
        broadcaster = new UpdateBroadcaster(options.counterUrl, options.url) ;
        broadcaster.fetchFromService(serviceName);
        broadcastersForUrls[options.url] = broadcaster;
    }
    broadcaster.register(buttonSetter);
};
