var services = require('./services'),
    Factory  = require('./factory'),
    utils    = require('./utils'),
    dom      = require('./dom');

var promises = {
    promises: {},
    /**
     * Fetch data
     * 
     * @param {String} service
     * @param {String} url
     * @param {Object} options
     * @return {Promise}
     */
    fetch: function (service, url, options) {
        if (!this.promises[service]) {
            this.promises[service] = {};
        }
        
        var promises = this.promises[service];
        
        if (!options.forceUpdate && promises[url]) {
            return promises[url];
        }
        
        var options = utils.merge(services[service], options),
            promise = Factory(),
            href    = options.counterUrl && utils.makeUrl(options.counterUrl, {
                url: url
            });
        
        if (href && typeof options.counter === 'function') {
            options.counter(href, promise, url);
        }
        else if (options.counterUrl) {
            this.getJSON(href, promise, options);
        }
        
        return promises[url] = promise;
    },
    
    /**
     * Deliver JSON
     * 
     * @param {String} url
     * @param {Promise} promise
     * @param {Object} options 
     */
    getJSON: function (url, promise, options) {
        dom.getJSON(url, function (count) {
            try {
                if (typeof options.convertNumber === 'function') {
                    count = options.convertNumber(count);
                }
                
                promise(count);
            } 
            catch (e) {}
        });
    }
};

module.exports = promises;