var services = require('./services'),
    Factory  = require('./factory'),
    utils    = require('./utils'),
    dom      = require('./dom');

var factories = {};

/**
 * Fetch data
 * 
 * @param {String} service
 * @param {String} url
 * @param {Object} options
 * @return {Promise}
 */
module.exports = function (service, url, options) {
    if (!factories[service]) {
        factories[service] = {};
    }
    
    var counters = factories[service],
        counter  = counters[url];
    
    if (!options.forceUpdate && counter) {
        return counters[url];
    }
    
    counter = Factory();
    
    var href = utils.makeUrl(options.counterUrl, {
        url: url
    });
    
    services[service].counter(href, counter, url);
    
    return counters[url] = counter;
};