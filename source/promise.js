var events = require('./events');

var Promise = function () {};

Promise.prototype = {
    always: function (callback) {
        this.on('rejected', callback);
        this.on('accepted', callback);
    },
    
    fail: function (callback) {
        this.on('rejected', callback);
    },
    
    done: function (callback) {
        this.on('accepted', callback);
    },
    
    reject: function () {
        this.emit('rejected');
    },
    
    resolve: function (arg) {
        this.emit('accepted', arg);
    }
};

events(Promise.prototype);

Promise.make = function () {
    return new Promise;
};

module.exports = Promise;