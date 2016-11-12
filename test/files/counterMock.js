'use strict'; // eslint-disable-line strict

window.__likelyCounterMock = function (url, callback) {
    // The callback (which is actually a factory from `factory.js`)
    // doesn’t save the passed argument if it’s passed synchronously.
    setTimeout(function () {
        callback(10);
    }, 0);
};
