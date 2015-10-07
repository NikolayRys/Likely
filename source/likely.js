"use strict";

var Likely = require('./widget'),
    config = require('./config'),
    utils  = require('./utils'),
    dom    = require('./dom');

/**
 * @param {Node} node
 * @param {Object} options
 */
var likely = function (node, options) {
    options = options || {};
    
    var likely = node[config.name];
    
    if (likely) {
        likely.update(options);
    }
    else {
        node[config.name] = new Likely(node, utils.merge(
            {}, window.likely.defaults, 
            options, utils.bools(node)
        ));
    }
}

/**
 * Initiate Likely buttons on load
 */
likely.initate = function () {
    var widgets = dom.findAll('.' + config.name);
    
    utils.toArray(widgets)
         .forEach(likely);
}

/**
 * Defaults options for likely 
 */
likely.defaults = {
    popupCheckInterval: 0.15e3,
    counters: true,
    timeout:  1e3,
    zeroes:   false,
    title:    document.title,
    wait:     0.5e3,
    url:      window.location.href.replace(window.location.hash, '')
};

window.likely = likely;
window.addEventListener('load', likely.initate);