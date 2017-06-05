import Factory from './factory';
import { makeUrl } from './utils';
import services from './services';

const factories = {};

/**
 * Fetch data
 *
 * @param {String} service
 * @param {String} url
 * @param {Object} options
 * @returns {Promise}
 */
export default (service, url, options) => {
    if (!factories[service]) {
        factories[service] = {};
    }

    const counters = factories[service];
    let counter = counters[url];

    if (!options.forceUpdate && counter) {
        return counter;
    }

    counter = Factory();

    const href = makeUrl(options.counterUrl, {
        url,
    });

    services[service].counter(href, counter, url);

    counters[url] = counter;
    return counter;
};
