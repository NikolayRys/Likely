import { createNode, find, findAll, openPopup, wrapSVG } from './dom';
import { extendWith, getDataset, interpolateStr, interpolateUrl, mergeToNew, toArray } from './utils';

import config from './config';
import connectButtonToService from './connectButtonToService';
import services from './services';

const htmlSpan = '<span class="{className}">{content}</span>';

/**
 * Individual social link button with a counter
 * @param {Node} serviceDiv
 * @param {object} options
 * @param {Function} reportReadinessFn
 */
class LikelyButton {
    #reportReadiness;

    constructor(sourceDiv, options, reportReadinessFn) {
        this.options = mergeToNew(options);
        this.sourceElement = sourceDiv;
        this.#reportReadiness = reportReadinessFn;
        this.renderedElement = null;
    }

    setService() {
        const classes = toArray(this.sourceElement.classList);
        const serviceName = classes.find((className) => Object.prototype.hasOwnProperty.call(services, className));
        if (serviceName) {
            this.options.service = services[serviceName];
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Make button ready for usage if it's connected
     */
    build() {
        if (this.#notServiceable()) {
            return;
        }
        this.#renderHtml();
        this.#animate();
    }

    /**
     * Update the button with new options and refresh its counter
     * @param {object} newOptions
     */
    update(newOptions) {
        if (this.#notServiceable()) {
            return;
        }
        extendWith(this.options, mergeToNew({ forceUpdate: false }, newOptions));
        this.#animate();
    }

    /**
     * Build button's HTML
     */
    #renderHtml() {
        // Import params from data-* attributes into options hash map
        this.data = getDataset(this.sourceElement);
        if (this.data.counter) {
            this.options.staticCounter = this.data.counter;
        }
        if (this.data.url) {
            this.options.url = this.data.url;
        }
        if (this.data.title) {
            this.options.title = this.data.title;
        }

        // Building new link element <a>
        this.renderedElement = document.createElement('a');

        // Arrange classes
        this.renderedElement.className = this.sourceElement.className;
        this.renderedElement.classList.remove(this.options.service.name);
        this.renderedElement.className += `${this.#className('widget')}`;

        // Copy accessibility attributes
        this.#transferAttribute('role');
        this.#transferAttribute('aria-label');

        const icon = interpolateStr(htmlSpan, {
            className: this.#className('icon'),
            content: wrapSVG(this.options.service.svgIconPath),
        });

        const button = interpolateStr(htmlSpan, {
            className: this.#className('button'),
            content: this.sourceElement.innerHTML,
        });

        this.renderedElement.innerHTML = icon + button;
    }

    #transferAttribute(attribute) {
        if (this.sourceElement.getAttribute(attribute) !== undefined) {
            this.renderedElement.setAttribute(attribute, this.sourceElement.getAttribute(attribute));
        }
    }

    #animate() {
        // Set up click event listener
        const shareUrl = this.#buildUrl(this.options);
        this.renderedElement.setAttribute('href', shareUrl);
        this.renderedElement.addEventListener('click', this.#shareClick(shareUrl).bind(this));

        if (this.options.counters && this.options.service.counterUrl) {
            // Set up counter
            if (this.options.staticCounter) {
                // Show static counter right away
                this.#showCounter(this.options.staticCounter);
            }
            else {
                // Otherwise, connect to the service
                connectButtonToService(this.#showCounter.bind(this), this.options);
            }
        }
        else {
            // Report readiness immediately if there's no counter
            this.#reportReadiness();
        }
    }

    /**
     * Combine a BEM-compliant classname
     * @param {string} className
     * @returns {string}
     */
    #className(className) {
        const fullClass = config.prefix + className;

        return `${fullClass} ${fullClass}_${this.options.service.name}`;
    }

    /**
     * Set visible button counter to a value
     * @param {string} counterString
     */
    #showCounter(counterString) {
        const counterInt = parseInt(counterString, 10) || 0;

        const className = `.${config.prefix}counter`;
        find(className, this.renderedElement)?.remove();

        const options = {
            className: this.#className('counter'),
            content: counterInt,
        };

        if (!counterInt && !this.options.zeroes) {
            options.className += ` ${config.prefix}counter_empty`;
            options.content = '';
        }

        this.renderedElement.appendChild(createNode(interpolateStr(htmlSpan, options)));

        this.#reportReadiness();
    }

    /**
     * Construct URL for sharing
     * @param {object} options
     * @returns {string}
     */
    #buildUrl(options) {
        options.service.urlCallback.call(this);
        const url = interpolateUrl(options.service.popupUrl, {
            url: options.url,
            title: options.title,
        });

        const paramsArray = [];
        this.options.service.knownParams.forEach((item) => {
            if (item === 'url' || item === 'title' || item === 'counter') {
                return; // Ignore base params
            }
            if (item in this.data) {
                paramsArray.push(`${encodeURIComponent(item)}=${encodeURIComponent(this.data[item])}`);
            }
        });
        const paramsString = paramsArray.join('&');
        const delimiter = url.indexOf('?') === -1 ? '?' : '&';
        return paramsString === '' ? url : url + delimiter + paramsString;
    }

    /**
     * Factory for click event handlers
     * @param {string} completeUrl
     * @returns {Function}
     */
    #shareClick(completeUrl) {
        return function (event) {
            const options = this.options;
            if (options.service.openPopup === true) {
                event.preventDefault();
                openPopup(
                    completeUrl,
                    config.prefix + this.options.service.name,
                    options.service.popupWidth,
                    options.service.popupHeight,
                );
                return false;
            }
            return true;
        };
    }

    #notServiceable() {
        return this.options.service === undefined;
    }
}
export default LikelyButton;
