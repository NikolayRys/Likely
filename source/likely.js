'use strict';

var likely = require('./index.js');

window.likely = likely;
window.addEventListener('load', likely.initiate);
