// This module is an entry point for CommonJS modules.
// It’s written with CommonJS imports and exports to make possible doing `module.exports = likely`.
// This is required so that users work with `require('likely')`, not `require('likely').default`
const { getBools, getDefaultUrl, mergeToNew } = require('./utils');
const Likely = require('./widget').default;
const config = require('./config').default;
const { findAll } = require('./dom');
const history = require('./history').default;
const services = require('./services').default;

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
        url: getDefaultUrl(),
    };

    const realOptions = mergeToNew(defaults, fullOptions, getBools(node));
    const widget = node[config.name];
    if (widget) {
        widget.update(realOptions);
    }
    else {
        // Attaching widget to the node object for future re-initializations
        node[config.name] = new Likely(node, realOptions);
    }

    return widget;
};

const likely = {
    /**
     * Initiate Likely buttons on load
     * @param {Node|Array<Node>|Object} [nodes] a particular node or an array of widgets,
     *                                     if not specified,
     *                                     tries to init all the widgets
     * @param {Object} [options] additional options for each widget
     */
    initiate(nodes, options) {
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

        this.maintainStoredData(realOptions);

        initWidgets();
        history.onUrlChange(initWidgets);

        function initWidgets() {
            realNodes.forEach((node) => {
                initWidget(node, realOptions);
            });
        }
    },

    /**
     * Reset stored broadcasters if forceUpdate is requested
     * @param {Object} realOptions
     */
    maintainStoredData(realOptions) {
        if (realOptions && realOptions.forceUpdate) {
            // Object.values() is not supported by IE
            Object.keys(services).forEach((serviceName) => {
                services[serviceName].resetBroadcasters();
            });
        }
    },
};

module.exports = likely;
