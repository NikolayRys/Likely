import {
    createNode,
    createTempLink,
    find,
    findAll,
    openPopup,
    wrapSVG,
} from './dom';
import { extend, getDataset, makeUrl, merge, query, template } from './utils';

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
        this.options = merge({}, options);

        this.init();
    }

    /**
     * Initiate the button
     */
    init() {
        this.inheritDatasetAndStyles();
        this.mergeDatasetIntoOptions();
        this.detectService();
        this.initButtonHtml();

        setTimeout(this.initCounter.bind(this), 0);
    }

    /**
     * Update the counter
     *
     * @param {Object} options
     */
    update(options) {
        const className = '.likely-button__counter';
        const counters = findAll(className, this.button);

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
        const button = this.button;
        const service = Object.keys(services).filter((service) =>
            button.classList.contains(service)
        )[0];

        extend(this.options, services[service]);
        this.service = service;
    }

    inheritDatasetAndStyles() {
        const parentElement = this.button.parentElement;
        if (!parentElement.classList.contains('likely')) {
            // The buttons aren’t wrapped into the .likely block,
            // so we don’t need to copy options
            return;
        }

        // Inherit the data-* params from the .likely block
        // (the button’s data-* params still have a higher priority)
        const likelyBlockData = getDataset(this.button.parentElement);
        const mergedData = merge({}, likelyBlockData, this.button.dataset);
        extend(this.button.dataset, mergedData);

        // Inherit the style classes
        if (parentElement.classList.contains('light') || parentElement.classList.contains('likely_light')) {
            this.button.classList.add('light');

            // Generally, buttons are independent and shouldn’t touch the likely block
            // except from inheriting settings from it. However, unfortunately,
            // if the likely block has the .light class, it must be replaced to avoid clashes
            // with other classes. We do this job here.
            parentElement.classList.remove('light');
            parentElement.classList.add('likely_light');
        }
    }

    /**
     * Merge params from data-* attributes into options hash map
     */
    mergeDatasetIntoOptions() {
        const data = getDataset(this.button);

        if (data.counter) {
            const counter = parseInt(data.counter, 10);

            if (isNaN(counter)) {
                this.options.counterUrl = data.counter;
            } else {
                this.options.counterNumber = counter;
            }
        }

        this.options.title = data.title || this.options.title;
        this.options.url = data.url || this.options.url;
    }

    /**
     * Inititate button's HTML
     */
    initButtonHtml() {
        const options = this.options;
        const button = this.button;
        const text = button.innerHTML;

        button.className = button.className
            .replace(this.service, `likely-button_service_${this.service}`)
            .replace('light', 'likely-button_light');

        const buttonHTML = template(htmlSpan, {
            className: 'likely-button__label',
            content: text,
        });

        const iconHTML = template(htmlSpan, {
            className: 'likely-button__icon',
            content: wrapSVG(options.svgIconPath),
        });

        button.innerHTML = iconHTML + buttonHTML;

        button.addEventListener('click', this.click.bind(this));
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
                this.updateCounter.bind(this)
            );

            setTimeout(this.appear.bind(this), this.options.wait);
        } else {
            this.appear();
        }
    }

    /**
     * Update counter
     *
     * @param {String} counterString
     */
    updateCounter(counterString) {
        const counter = parseInt(counterString, 10) || 0;

        const counterElement = find('.likely-button__counter', this.button);

        if (counterElement) {
            counterElement.parentNode.removeChild(counterElement);
        }

        const options = {
            className: 'likely-button__counter',
            content: counter,
        };

        if (!counter && !this.options.zeroes) {
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
                `likely-button__${this.service}`,
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
        const parameters = query(merge(this.button.dataset, this.options.data));
        const delimeter = url.indexOf('?') === -1 ? '?' : '&';

        return parameters === '' ? url : url + delimeter + parameters;
    }

    appear() {
        this.button.classList.add('likely-button_visibility_visible');
    }
}

export default LikelyButton;
