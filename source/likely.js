"use strict";

var Likely = require('./widget'),
    config = require('./config'),
    utils  = require('./utils'),
    dom    = require('./dom');

/**
 * @param {Node} node
 * @param {Object} options
 */
window.socialLikes = function (node, options) {
    options = options || {};
    
    var likely = node[config.name];
    
    if (likely) {
        likely.update(options);
    }
    else {
        node[config.name] = new Likely(node, utils.merge(
            {}, socialLikes.defaults, 
            options, utils.bools(node)
        ));
    }
}

/**
 * Defaults options for socialLikes 
 */
window.socialLikes.defaults = {
    popupCheckInterval: 0.15e3,
    counters: true,
    timeout:  1e3,
    zeroes:   false,
    title:    document.title,
    wait:     0.5e3,
    url:      window.location.href.replace(window.location.hash, '')
};

window.addEventListener('load', function () {
    var widgets = dom.findAll('.' + config.name);
    
    utils.toArray(widgets)
         .forEach(socialLikes);
});