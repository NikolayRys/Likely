import { createNode, createTempLink, find, findAll, openPopup, wrapSVG } from './dom';
import { extendWith, getDataset, interpolateStr, interpolateUrl, mergeToNew, query } from './utils';

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
        this.options = mergeToNew(options);
        this.detectService();
        if (this.isValid()) {
            this.detectParams();
        }
    }

    isValid() {
        return this.options.service !== undefined;
    }

    prepare() {
        if (this.options.service.name) {
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
        extendWith(this.options, mergeToNew({ forceUpdate: false }, options));
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
        this.options.service = services[serviceName];
    }

    /**
     * Merge params from data-* attributes into options hash map
     */
    detectParams() {
        const options = this.options;
        const data = getDataset(this.widget);

        if (data.counter) {
            options.staticCounter = data.counter;
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
        widget.classList.remove(this.options.service.name);
        widget.className += `${this.className('widget')}`;

        const button = interpolateStr(htmlSpan, {
            className: this.className('button'),
            content: text,
        });

        const icon = interpolateStr(htmlSpan, {
            className: this.className('icon'),
            content: wrapSVG(options.service.svgIconPath),
        });

        widget.innerHTML = icon + button;
    }

    /**
     * Fetch or get cached counter value and update the counter
     */
    registerAsCounted() {
        const options = this.options;
        if (options.counters && options.service.counterUrl) {
            if (options.staticCounter) {
                this.setDisplayedCounter(options.staticCounter);
            }
            else {
                connectButtonToService(this.setDisplayedCounter.bind(this), options);
            }
        }
    }

    /**
     * @param {String} className
     * @returns {String}
     */
    className(className) {
        const fullClass = config.prefix + className;

        return `${fullClass} ${fullClass}_${this.options.service.name}`;
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

        if (options.service.click.call(this)) {
            const urlWithBaseParams = interpolateUrl(options.service.popupUrl, {
                url: options.url,
                title: options.title,
                content: options.content,
            });
            const completeUrl = this.addAdditionalParamsToUrl(urlWithBaseParams);

            if (options.service.openPopup === false) {
                createTempLink(completeUrl);
                return false;
            }

            openPopup(
                completeUrl,
                config.prefix + this.options.service.name,
                options.service.popupWidth,
                options.service.popupHeight
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
        const parameters = query(mergeToNew(this.widget.dataset, this.options.data), this.options.service.knownParams, this.options.service.name);
        const delimeter = url.indexOf('?') === -1 ? '?' : '&';
        return parameters === ''
            ? url
            : url + delimeter + parameters;
    }
}

export default LikelyButton;
