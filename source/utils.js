var config = require('./config');

var bool = {yes: true, no: false},
    rUrl = /(https?|ftp):\/\/[^\s\/$.?#].[^\s]*/gi;

/**
 * Simple $.each, only for objects
 * 
 * @param {Object} object
 * @param {Function} callback
 */
var each = function (object, callback) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            callback(object[key], key);
        }
    }
};

/**
 * Convert array-like object to array
 * 
 * @param {Object} arrayLike
 * @return {Array}
 */
function toArray (arrayLike) {
    return Array.prototype.slice.call(arrayLike);
}

/**
 * Merge given dictionaries (objects) into one object
 * 
 * @param {Object} ...objects
 * @return {Object}
 */
function merge () {
    var result = {};
    
    for (var i = 0; i < arguments.length; i ++) {
        var arg = arguments[i];
        
        if (arg) {
            for (var key in arg) {
                result[key] = arg[key];
            }
        }
    }
    
    return result;
}

/**
 * Extend one (target) object by other (subject)
 * 
 * @param {Object} target
 * @param {Object} subject
 */
function extend (target, subject) {
    for (var key in subject) {
        target[key] = subject[key];
    }
}

/**
 * Convert "yes" and "no" to true and false.
 * 
 * @param {jQuery} node
 */
function bools (node) {
    var result = {},
        data   = node.dataset;
    
    for (var key in data) {
        var value = data[key];
        
        result[key] = bool[value] || value;
    }
    
    return result;
}

/**
 * Map object keys in string to its values
 * 
 * @param {String} text
 * @param {Object} data
 * @return {String}
 */
function template (text, data) {
    return text.replace(/\{([^\}]+)\}/g, function (value, key) {
        return key in data ? data[key] : value;
    });
}

/**
 * Map object keys in URL to its values
 * 
 * @param {String} text
 * @param {Object} data
 * @return {String}
 */
function makeUrl (text, data) {
    for (var key in data) {
        data[key] = encodeURIComponent(data[key]);
    }
    
    return template(text, data);
}

/**
 * Construct a CSS class
 * 
 * @param {String} type
 * @param {String} service
 * @return {String}
 */
function likelyClass (type, service) {
    var fullClass = config.prefix + type;
    
    return fullClass + " " + fullClass + "_" + service;
}

/**
 * Create query string out of data
 * 
 * @param {Object} data
 * @return {String}
 */
function query (data) {
    var filter = encodeURIComponent,
        query  = [];
    
    for (var key in data) {
        if (typeof data[key] === 'object') continue;
        
        query.push(filter(key) + '=' + filter(data[key]));
    }
    
    return query.join('&');
}

/**
 * Get URL of invoked script from Stack error 
 * 
 * @return {String}
 */
function getStackURL () {
    try {
        throw new Error;
    }
    catch (e) {
        var stack = e.stack, 
            url   = stack.match(rUrl).pop()
                         .replace(/:\d+:\d+$/, '');;
        
        return url;
    }
}

function getURL (url) {
    return decodeURIComponent(url.match(/url=([^&]+)/).pop());
}

module.exports = {
    likelyClass: likelyClass,
    getStackURL: getStackURL,
    template:    template,
    makeUrl:     makeUrl,
    toArray:     toArray,
    getURL:      getURL,
    extend:      extend,
    merge:       merge,
    bools:       bools,
    query:       query,
    each:        each,
};