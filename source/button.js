import { createNode, find, findAll, openPopup, wrapSVG } from './dom';
import { extend, getDataset, makeUrl, merge, query, template } from './utils';

import config from './config';
import fetch from './fetch';
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

        this.init();
    }

    /**
     * Initiate the button
     */
    init() {
        this.detectService();
        this.detectParams();

        if (this.service) {
            this.initHtml();

            setTimeout(this.initCounter.bind(this), 0);
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

        this.initCounter();
    }

    /**
     * Get the config.name of service and its options
     */
    detectService() {
        const widget = this.widget;
        let service = getDataset(widget).service;

        if (!service) {
            service = Object.keys(services).filter((service) => widget.classList.contains(service))[0];
        }

        if (service) {
            this.service = service;

            extend(this.options, services[service]);
        }
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
     * Inititate button's HTML
     */
    initHtml() {
        const options = this.options;
        const widget = this.widget;
        const text = widget.innerHTML;

        widget.addEventListener('click', this.click.bind(this));
        widget.classList.remove(this.service);
        widget.className += ` ${this.className('widget')}`;

        const button = template(htmlSpan, {
            className: this.className('button'),
            content: text,
        });

        const icon = template(htmlSpan, {
            className: this.className('icon'),
            content: wrapSVG(options.svgi),
        });

        widget.innerHTML = icon + button;
    }

    /**
     * Fetch or get cached counter value and update the counter
     */
    initCounter() {
        const options = this.options;

        if (options.counters && options.counterNumber) {
            this.updateCounter(options.counterNumber);
        }
        else if (options.counterUrl) {
            fetch(
                this.service,
                options.url,
                options
            )(this.updateCounter.bind(this));
        }
    }

    /**
     * @param {String} className
     * @returns {String}
     */
    className(className) {
        const fullClass = config.prefix + className;

        return `${fullClass} ${fullClass}_${this.service}`;
    }

    /**
     * Update counter
     *
     * @param {String} counterString
     */
    updateCounter(counterString) {
        const counter = parseInt(counterString, 10) || 0;

        const counterElement = find(`.${config.name}__counter`, this.widget);

        if (counterElement) {
            counterElement.parentNode.removeChild(counterElement);
        }

        const options = {
            className: this.className('counter'),
            content: counter,
        };

        if (!counter && !this.options.zeroes) {
            options.className += ` ${config.prefix}counter_empty`;
            options.content = '';
        }

        this.widget.appendChild(
            createNode(template(htmlSpan, options))
        );

        this.likely.updateCounter(this.service, counter);
    }

    /**
     * Click event listener
     * @returns {Boolean}
     */
    click() {
        const options = this.options;

        if (options.click.call(this)) {
            const url = makeUrl(options.popupUrl, {
                url: options.url,
                title: options.title,
            });

            openPopup(
                this.addAdditionalParamsToUrl(url),
                config.prefix + this.service,
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
