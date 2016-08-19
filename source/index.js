'use strict';

var Likely = require('./widget');
var config = require('./config');
var utils = require('./utils');
var dom = require('./dom');

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

/**
 * @deprecated
 * @returns {Likely}
 */
var likely = function () {
    // eslint-disable-next-line no-console
    console.warn('likely function is DEPRECATED and will be removed in 3.0. Use likely.initiate instead.');
    return likely.initiate.apply(likely, arguments);
};

/**
 * Initiate Likely buttons on load
 * @param {Node|Array<Node>|Object} [node] a particular node or an array of widgets,
 *                                     if not specified,
 *                                     tries to init all the widgets
 * @param {Object} [options] additional options for each widget
 */
likely.initiate = likely.initate = function (node, options) {
    // There're three different ways:
    // - node is a node
    // - node is an array of nodes
    // - node is not a node, it's options (polymorphism)
    var nodes;

    if (Array.isArray(node)) {
        nodes = node;
    }
    else if (node instanceof Node) {
        nodes = [node];
    }
    else {
        nodes = dom.findAll('.' + config.name);
        // eslint-disable-next-line no-param-reassign
        options = node;
    }
    utils.toArray(nodes)
        .forEach(function (node) {
            initWidget(node, options);
        });
};

module.exports = likely;
