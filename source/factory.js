/**
 * Factory function
 * 
 * This function returns function with following API:
 * 
 * - if passed argument is callback, then this callback would be callled
 *   if the value was changed
 * - if passed argument is anything but undefined or function, then this 
 *   function behaves like setter
 * - if argument isn't provided, then return value stored in closure
 * 
 * @param {Object} value
 * @return {Function}
 */
module.exports = function (value) {
    var listeners = [];
    
    var listen = function (listener) {
        listeners.push(listener);
    };
    
    var set = function (newValue) {
        value = newValue;
        
        listeners.forEach(function (listener) {
            listener(newValue);
        });
    };
    
    var get = function () {
        return value;
    };
    
    return function (argument) {
        var type = typeof argument;
        
        if (type == 'undefined') {
            return get();
        }
        else if (type == 'function') {
            listen(argument);
        }
        else {
            set(argument);
        }
    };
};