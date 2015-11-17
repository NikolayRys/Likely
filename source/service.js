var dom = require('./dom');

/**
 * @param {String} url
 * @param {Function} factory
 */
var counter = function (url, factory) {
    var self = this;
    
    dom.getJSON(url, function (count) {
        try {
            if (typeof self.convertNumber === 'function') {
                count = self.convertNumber(count);
            }
            
            factory(count);
        } 
        catch (e) {}
    });
};

/**
 * @param {Object} options
 */
module.exports = function (options) {
    options.counter = options.counter || counter;
    options.click   = options.click   || function () { return true; };
};