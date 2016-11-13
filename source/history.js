'use strict';

var utils = require('./utils');

var setupHistoryWatcher = function () {
    var pushState = window.history.pushState;
    window.history.pushState = function () {
        // browser should change the url first
        setTimeout(handleUrlChange, 0);
        return pushState.apply(window.history, arguments);
    }.bind(this);

    var replaceState = window.history.replaceState;
    window.history.replaceState = function () {
        // browser should change the url first
        setTimeout(handleUrlChange, 0);
        return replaceState.apply(window.history, arguments);
    }.bind(this);

    window.addEventListener('popstate', handleUrlChange);
};


var callbacks = [];
var handleUrlChange = function () {
    callbacks.forEach(function (callback) {
        callback();
    });
};

var isWatchingHistory = false;

var history = {
    onUrlChange: function (callback) {
        if (!isWatchingHistory) {
            setupHistoryWatcher();
            isWatchingHistory = true;
        }

        callbacks.push(callback);
    },
};

module.exports = history;
