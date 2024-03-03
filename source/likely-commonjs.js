// This module is an entry point for CommonJS modules.
// It’s written with CommonJS imports and exports to make possible doing `module.exports = likely`.
// This is required so that users work with `require('likely')`, not `require('likely').default`
const { getBools, getDefaultUrl, mergeToNew } = require('./utils');
const likelyWidget = require('./widget').default;
const config = require('./config').default;
const { findAll } = require('./dom');
const history = require('./history').default;
const services = require('./services').default;

/**
 * @param {Node} likelyRoot
 * @param {Object} options
 * @private
 * @returns {likelyWidget}
 */
const placeWidget = (likelyRoot, options) => {
    const providedOptions = options || {};
    const defaultOptions = {
        counters: true,
        timeout: 1e3,
        zeroes: false,
        title: document.title,
        url: getDefaultUrl(),
    };

    const completeOptions = mergeToNew(defaultOptions, providedOptions, getBools(likelyRoot));
    const widget = likelyRoot[config.name];
    if (widget) {
        widget.update(completeOptions);
    }
    else {
        likelyRoot[config.name] = new likelyWidget(likelyRoot, completeOptions);
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
            realNodes.forEach((node) => placeWidget(node, realOptions));
        }
    },

    /**
     * Reset stored broadcasters if forceUpdate is requested
     * @param {Object} realOptions
     */
    maintainStoredData(realOptions) {
        if (realOptions && realOptions.forceUpdate) {
            Object.values(services).forEach((service) => {
                service.resetBroadcasters();
            });
        }
    },
};

module.exports = likely;
