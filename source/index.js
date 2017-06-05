// This module is an entry point for CommonJS modules.
// It’s written with CommonJS imports and exports to make possible doing `module.exports = likely`.
// This is required so that users work with `require('likely')`, not `require('likely').default`

const { bools, getDefaultUrl, merge } = require('./utils');

const Likely = require('./widget').default;
const config = require('./config').default;
const { findAll } = require('./dom');
const history = require('./history').default;

/**
 * @param {Node} node
 * @param {Object} options
 * @private
 * @returns {Likely}
 */
const initWidget = (node, options) => {
    const fullOptions = options || {};
    const defaults = {
        counters: true,
        timeout: 1e3,
        zeroes: false,
        title: document.title,
        wait: 0.5e3,
        url: getDefaultUrl(),
    };
    const widget = node[config.name];

    const realOptions = merge({}, defaults, fullOptions, bools(node));
    if (widget) {
        widget.update(realOptions);
    }
    else {
        node[config.name] = new Likely(node, realOptions);
    }

    return widget;
};

/**
 * @deprecated
 * @returns {Likely}
 */
class likely {
    constructor() {
        // eslint-disable-next-line no-console
        console.warn('likely function is DEPRECATED and will be removed in 3.0. Use likely.initiate instead.');
        return likely.initiate(...arguments);
    }

    static initate() {
        // eslint-disable-next-line no-console
        console.warn('likely.initate function is DEPRECATED and will be removed in 3.0. Use likely.initiate instead.');
        return likely.initiate(...arguments);
    }

    /**
     * Initiate Likely buttons on load
     * @param {Node|Array<Node>|Object} [nodes] a particular node or an array of widgets,
     *                                     if not specified,
     *                                     tries to init all the widgets
     * @param {Object} [options] additional options for each widget
     */
    static initiate(nodes, options) {
        let realNodes;
        let realOptions;

        if (Array.isArray(nodes)) {
            // An array of nodes was passed
            realNodes = nodes;
            realOptions = options;
        }
        else if (nodes instanceof Node) {
            // A single node was passed
            realNodes = [nodes];
            realOptions = options;
        }
        else {
            // Options were passed, or the function was called without arguments
            realNodes = findAll(`.${config.name}`);
            realOptions = nodes;
        }

        initWidgets();
        history.onUrlChange(initWidgets);

        function initWidgets() {
            realNodes.forEach((node) => {
                initWidget(node, realOptions);
            });
        }
    }
}

module.exports = likely;
