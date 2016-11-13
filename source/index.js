'use strict';

var Likely = require('./widget');
var config = require('./config');
var utils = require('./utils');
var dom = require('./dom');
var history = require('./history');

/**
 * @param {Node} node
 * @param {Object} options
 * @private
 * @returns {Likely}
 */
var initWidget = function (node, options) {
    var fullOptions = options || {};
    var defaults = {
        counters: true,
        timeout: 1e3,
        zeroes: false,
        title: document.title,
        wait: 0.5e3,
        url: utils.getDefaultUrl(),
    };
    var widget = node[config.name];

    if (widget) {
        widget.update(fullOptions);
    }
    else {
        node[config.name] = new Likely(node, utils.merge(
            {}, defaults,
            fullOptions, utils.bools(node)
        ));
    }

    return widget;
};

var initLikely = function (nodes, options) {
    var realNodes;
    if (Array.isArray(nodes)) {
        // An array of nodes was passed
        realNodes = nodes;
    } else if (nodes instanceof Node) {
        // A single node was passed
        realNodes = [nodes];
    } else {
        // Options were passed, or null/undefined was passed, or the function was called without arguments
        // Find and initialize all existing Likely widgets
        realNodes = dom.findAll('.' + config.name);
    }

    var realOptions = options || nodes || {};

    realNodes.forEach(function (node) {
        initWidget(node, realOptions);
    });
};

/**
 * @deprecated
 * @returns {Likely}
 */
var likely = function () {
    // eslint-disable-next-line no-console
    console.warn('likely function is DEPRECATED and will be removed in 3.0. Use likely.initiate instead.');
    return likely.initiate.apply(likely, arguments);
};

likely.initate = function () {
    // eslint-disable-next-line no-console
    console.warn('likely.initate function is DEPRECATED and will be removed in 3.0. Use likely.initiate instead.');
    return likely.initiate.apply(likely, arguments);
};


/**
 * Initiate Likely buttons on load
 * @param {Node|Array<Node>|Object} [nodes] a particular node or an array of widgets,
 *                                     if not specified,
 *                                     tries to init all the widgets
 * @param {Object} [options] additional options for each widget
 */
likely.initiate = function (nodes, options) {
    initLikely(nodes, options);

    history.onUrlChange(function () {
        initLikely(nodes, utils.extend({
            forceUpdate: true,
            url: utils.getDefaultUrl(),
        }, options));
    });
};

module.exports = likely;
