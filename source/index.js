import Likely from './widget';
import config from './config';
import dom from './dom';
import utils from './utils';

/**
 * @param {Node} node
 * @param {Object} options
 * @returns {Likely}
 */
const likely = (node, options) => {
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
 * Initiate Likely buttons on load
 * @param {Object} [options] additional options for each widget
 */
likely.initiate = likely.initate = options => {
    const widgets = dom.findAll(`.${config.name}`);

    utils.toArray(widgets)
        .forEach(widget => {
            likely(widget, options);
        });
};

export default likely;
