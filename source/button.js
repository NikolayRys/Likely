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
        this.renderedElement = null; // ToDo: Park result here
    }

    readParams() {
        const classes = toArray(this.sourceElement.classList);
        const serviceName = classes.find((className) => Object.prototype.hasOwnProperty.call(services, className));
        if (serviceName) {
            this.options.service = services[serviceName];

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
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Make button ready for usage if it's connected
     */
    materialize() {
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
     * Initiate button's HTML
     */
    #renderHtml() {
        const originalDomElement = this.sourceElement;
        const originalText = originalDomElement.innerHTML;

        // Rebuilding element tag from <div> to <a>
        const renderedElement = document.createElement('a');
        renderedElement.innerHTML = originalDomElement.innerHTML;
        renderedElement.className = originalDomElement.className;

        // Copy accessibility attributes
        if (originalDomElement.getAttribute('role') !== undefined) {
            renderedElement.setAttribute('role', originalDomElement.getAttribute('role'));
        }
        if (originalDomElement.getAttribute('aria-label') !== undefined) {
            renderedElement.setAttribute('aria-label', originalDomElement.getAttribute('aria-label'));
        }

        // Todo: extract SWAP to the widget class
        originalDomElement.parentNode.replaceChild(renderedElement, originalDomElement);
        this.sourceElement = renderedElement;
        // END SWAP

        this.sourceElement.classList.remove(this.options.service.name);
        this.sourceElement.className += `${this.#className('widget')}`;

        const icon = interpolateStr(htmlSpan, {
            className: this.#className('icon'),
            content: wrapSVG(this.options.service.svgIconPath),
        });

        const button = interpolateStr(htmlSpan, {
            className: this.#className('button'),
            content: originalText,
        });

        this.sourceElement.innerHTML = icon + button;
    }

    #animate() {
        // Set up click event listener
        const shareUrl = this.#buildUrl(this.options);
        this.sourceElement.setAttribute('href', shareUrl);
        this.sourceElement.addEventListener('click', this.#shareClick(shareUrl).bind(this));

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
        find(className, this.sourceElement)?.remove();

        const options = {
            className: this.#className('counter'),
            content: counterInt,
        };

        if (!counterInt && !this.options.zeroes) {
            options.className += ` ${config.prefix}counter_empty`;
            options.content = '';
        }

        this.sourceElement.appendChild(createNode(interpolateStr(htmlSpan, options)));

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
