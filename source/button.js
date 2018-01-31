import {
    createNode,
    createTempLink,
    find,
    findAll,
    openPopup,
    wrapSVG,
} from './dom';
import { extend, getDataset, makeUrl, merge, query, template } from './utils';

import config from './config';
import fetch from './fetch';
import services from './services';

const htmlSpan = '<span class="{className}">{content}</span>';

/**
 * Separate social link button
 */
class LikelyButton {
    /**
     * @param {Node} button
     * @param {Object} options
     */
    constructor(button, options) {
        this.button = button;
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
        const counters = findAll(className, this.button);

        extend(this.options, merge({ forceUpdate: false }, options));
        counters.forEach(node => {
            node.parentNode.removeChild(node);
        });

        this.initCounter();
    }

    /**
     * Get the config.name of service and its options
     */
    detectService() {
        const button = this.button;
        let service = getDataset(button).service;

        if (!service) {
            service = Object.keys(services).filter(service =>
                button.classList.contains(service),
            )[0];
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
        const data = getDataset(this.button);

        if (data.counter) {
            const counter = parseInt(data.counter, 10);

            if (isNaN(counter)) {
                options.counterUrl = data.counter;
            } else {
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
        const button = this.button;
        const text = button.innerHTML;

        button.addEventListener('click', this.click.bind(this));
        button.classList.remove(this.service);
        button.classList.add(`${config.name}_service_${this.service}`);

        const buttonHTML = template(htmlSpan, {
            className: this.className('button'),
            content: text,
        });

        const iconHTML = template(htmlSpan, {
            className: this.className('icon'),
            content: wrapSVG(options.svgIconPath),
        });

        button.innerHTML = iconHTML + buttonHTML;
    }

    /**
     * Fetch or get cached counter value and update the counter
     */
    initCounter() {
        const options = this.options;

        if (options.counters && options.counterNumber) {
            this.updateCounter(options.counterNumber);
        } else if (options.counters && options.counterUrl) {
            fetch(this.service, options.url, options)(
                this.updateCounter.bind(this),
            );

            setTimeout(this.appear.bind(this), this.options.wait);
        } else {
            this.appear();
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

        const counterElement = find(`.${config.name}__counter`, this.button);

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

        this.button.appendChild(createNode(template(htmlSpan, options)));

        this.appear();
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

            if (options.openPopup === false) {
                createTempLink(this.addAdditionalParamsToUrl(url));
                return false;
            }

            openPopup(
                this.addAdditionalParamsToUrl(url),
                config.prefix + this.service,
                options.popupWidth,
                options.popupHeight,
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
        const parameters = query(merge(this.button.dataset, this.options.data));
        const delimeter = url.indexOf('?') === -1 ? '?' : '&';

        return parameters === '' ? url : url + delimeter + parameters;
    }

    appear() {
        this.button.classList.add(`${config.name}_visibility_visible`);
    }
}

export default LikelyButton;
