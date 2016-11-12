import Likely from './widget';
import config from './config';
import dom from './dom';
import utils from './utils';

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
        url: utils.getDefaultUrl(),
    };
    const widget = node[config.name];

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
class likely {
    constructor() {
        // eslint-disable-next-line no-console
        console.warn('likely function is DEPRECATED and will be removed in 3.0. Use likely.initiate instead.');
        return likely.initiate(...arguments);
    }

    /**
     * Initiate Likely buttons on load
     * @param {Node|Array<Node>|Object} [node] a particular node or an array of widgets,
     *                                     if not specified,
     *                                     tries to init all the widgets
     * @param {Object} [options] additional options for each widget
     */
    static initiate(node, options) {
        // There're three different ways:
        // - node is a node
        // - node is an array of nodes
        // - node is not a node, it's options (polymorphism)
        let nodes;

        if (Array.isArray(node)) {
            nodes = node;
        }
        else if (node instanceof Node) {
            nodes = [node];
        }
        else {
            nodes = dom.findAll(`.${config.name}`);
            // eslint-disable-next-line no-param-reassign
            options = node;
        }
        utils.toArray(nodes)
            .forEach((node) => {
                initWidget(node, options);
            });
    }

    static initate() {
        // eslint-disable-next-line no-console
        console.warn('likely.initate function is DEPRECATED and will be removed in 3.0. Use likely.initiate instead.');
        return likely.initiate(...arguments);
    }
}

export default likely;
