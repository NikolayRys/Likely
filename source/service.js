var dom = require('./dom');

var counter = function (url, promise) {
    var self = this;
    
    dom.getJSON(url, function (count) {
        try {
            if (typeof self.convertNumber === 'function') {
                count = self.convertNumber(count);
            }
            
            promise(count);
        } 
        catch (e) {}
    });
};

module.exports = function (options) {
    options.counter = options.counter || counter;
    options.click   = options.click   || function () { return true; };
    
    return options;
};