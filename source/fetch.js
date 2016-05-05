'use strict';

var services = require('./services');
var Factory = require('./factory');
var utils = require('./utils');

var factories = {};

/**
 * Fetch data
 *
 * @param {String} service
 * @param {String} url
 * @param {Object} options
 * @returns {Promise}
 */
module.exports = function (service, url, options) {
    if (!factories[service]) {
        factories[service] = {};
    }

    var counters = factories[service];
    var counter = counters[url];

    if (!options.forceUpdate && counter) {
        return counter;
    }

    counter = Factory();

    var href = utils.makeUrl(options.counterUrl, {
        url: url,
    });

    services[service].counter(href, counter, url);

    counters[url] = counter;
    return counter;
};
