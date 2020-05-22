import { createNode, createTempLink, find, findAll, openPopup, wrapSVG } from './dom';
import { extend, getDataset, interpolateStr, interpolateUrl, merge, query } from './utils';

import config from './config';
import connectButtonToService from './connectButtonToService';
import services from './services';

const htmlSpan = '<span class="{className}">{content}</span>';

/**
 * Separate social link widget
 *
 * @param {Node} widget
 * @param {Likely} likely
 * @param {Object} options
 */
class LikelyButton {
    constructor(widget, likely, options) {
        this.widget = widget;
        this.likely = likely;
        this.options = merge(options);
        this.serviceName = this.detectService();

        this.detectParams();
    }

    prepare() {
        if (this.serviceName) {
            this.initHtml();
            this.registerAsCounted();
        }
    }

    /**
     * Update the counter
     *
     * @param {Object} options
     */
    update(options) {
        const className = `.${config.prefix}counter`;
        const counters = findAll(className, this.widget);
        extend(this.options, merge({ forceUpdate: false }, options));
        counters.forEach((node) => {
            node.parentNode.removeChild(node);
        });
        this.registerAsCounted();
    }

    /**
     * Get the config.name of service and its options
     */
    detectService() {
        const widget = this.widget;
        const serviceName = getDataset(widget).service ||
            Object.keys(services).filter((service) => widget.classList.contains(service))[0];

        if (serviceName) {
            extend(this.options, services[serviceName]);
        }
        return serviceName;
    }

    /**
     * Merge params from data-* attributes into options hash map
     */
    detectParams() {
        const options = this.options;
        const data = getDataset(this.widget);

        if (data.counter) {
            const counter = parseInt(data.counter, 10);

            if (isNaN(counter)) {
                options.counterUrl = data.counter;
            }
            else {
                options.counterNumber = counter;
            }
        }

        options.title = data.title || options.title;
        options.url = data.url || options.url;
    }

    /**
     * Initiate button's HTML
     */
    initHtml() {
        const options = this.options;
        const widget = this.widget;
        const text = widget.innerHTML;

        widget.addEventListener('click', this.click.bind(this));
        widget.classList.remove(this.serviceName);
        widget.className += ` ${this.className('widget')}`;

        const button = interpolateStr(htmlSpan, {
            className: this.className('button'),
            content: text,
        });

        const icon = interpolateStr(htmlSpan, {
            className: this.className('icon'),
            content: wrapSVG(options.svgIconPath),
        });

        widget.innerHTML = icon + button;
    }

    /**
     * Fetch or get cached counter value and update the counter
     */
    registerAsCounted() {
        const options = this.options;
        if (options.counterUrl) {
            connectButtonToService(this.serviceName, this.setDisplayedCounter.bind(this), options);
        }
    }

    /**
     * @param {String} className
     * @returns {String}
     */
    className(className) {
        const fullClass = config.prefix + className;

        return `${fullClass} ${fullClass}_${this.serviceName}`;
    }

    /**
     * Update counter
     *
     * @param {String} counterString
     */
    setDisplayedCounter(counterString) {
        const counterInt = parseInt(counterString, 10) || 0;
        const counterElement = find(`.${config.name}__counter`, this.widget);

        if (counterElement) {
            counterElement.parentNode.removeChild(counterElement);
        }

        const options = {
            className: this.className('counter'),
            content: counterInt,
        };

        if (!counterInt && !this.options.zeroes) {
            options.className += ` ${config.prefix}counter_empty`;
            options.content = '';
        }

        this.widget.appendChild(
            createNode(interpolateStr(htmlSpan, options))
        );

        this.likely.finalize();
    }

    /**
     * Click event listener
     * @returns {Boolean}
     */
    click() {
        const options = this.options;

        if (options.click.call(this)) {
            const url = interpolateUrl(options.popupUrl, {
                url: options.url,
                title: options.title,
            });

            if (options.openPopup === false) {
                createTempLink(this.addAdditionalParamsToUrl(url));
                return false;
            }

            openPopup(
                this.addAdditionalParamsToUrl(url),
                config.prefix + this.serviceName,
                options.popupWidth,
                options.popupHeight
            );
        }

        return false;
    }

    /**
     * Append service data to URL
     *
     * @param {String} url
     * @returns {String}
     */
    addAdditionalParamsToUrl(url) {
        const parameters = query(merge(this.widget.dataset, this.options.data));
        const delimeter = url.indexOf('?') === -1 ? '?' : '&';

        return parameters === ''
            ? url
            : url + delimeter + parameters;
    }
}

export default LikelyButton;
