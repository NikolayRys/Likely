// This module is an entry point for CommonJS modules.
// It’s written with CommonJS imports and exports to make possible doing `module.exports = likely`.
// This is required so that users work with `require('likely')`, not `require('likely').default`
const { bools, getDefaultUrl, merge } = require('./utils');

const Button = require('./button').default;
const { findAll } = require('./dom');
const history = require('./history').default;
require('./index.styl');

/**
 * @param {Node} node
 * @param {Object} options
 * @private
 * @returns {Button}
 */
const initButton = (node, options) => {
    const fullOptions = options || {};
    const defaults = {
        counters: true,
        zeroes: false,
        title: document.title,
        wait: 0.5e3,
        url: getDefaultUrl(),
    };

    const NODE_STORAGE_FIELD = '_likelyButtonData';
    const button = node[NODE_STORAGE_FIELD];

    const realOptions = merge({}, defaults, fullOptions, bools(node));
    if (button) {
        button.update(realOptions);
    } else {
        node[NODE_STORAGE_FIELD] = new Button(node, realOptions);
    }

    return button;
};

/**
 * Initiate Likely buttons on load
 * @param {Node|Array<Node>|Object} [nodes] a particular node or an array of widgets,
 *                                     if not specified,
 *                                     tries to init all the widgets
 * @param {Object} [options] additional options for each widget
 */
const initiate = (nodes, options) => {
    let realNodes;
    let realOptions;

    if (Array.isArray(nodes)) {
        // An array of nodes was passed
        realNodes = nodes;
        realOptions = options;
    } else if (nodes instanceof Node) {
        // A single node was passed
        realNodes = [nodes];
        realOptions = options;
    } else {
        // Options were passed, or the function was called without arguments
        realNodes = findAll('.likely-button');
        realOptions = nodes;
    }

    initButtons();
    history.onUrlChange(initButtons);

    function initButtons() {
        realNodes.forEach(node => {
            initButton(node, realOptions);
        });
    }
};

exports.initiate = initiate;
