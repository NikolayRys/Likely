'use strict';

var likely = require('./index.js');
var history = require('./history');

window.addEventListener('load', function () {
    likely.initiate();
});

module.exports = likely;
