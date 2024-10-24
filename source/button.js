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

    isCountable() {
        return this.options.counters && this.options.service.counterUrl;
    }

    /**
     * Make button ready for usage if it's connected
     */
    prepare() {
        if (this.#isServiceable()) {
            this.#renderHtml();
            this.#animate();
        }
    }

    /**
     * Refresh the counter
     * @param {object} options
     */
    refresh(options) {
        if (this.#isServiceable()) {
            this.#resetCountersOnSameService(options);
            this.#animate();
        }
    }

    #isServiceable() {
        return this.options.service !== undefined;
    }

    /**
     * Initiate button's HTML
     */
    #renderHtml() {
        const oldServiceDomElement = this.sourceElement;
        const text = oldServiceDomElement.innerHTML;

        // Rebuilding element tag from <div> to <a>
        const newElement = document.createElement('a');
        newElement.innerHTML = oldServiceDomElement.innerHTML;
        newElement.className = oldServiceDomElement.className;

        // Copy accessibility attributes
        if (oldServiceDomElement.getAttribute('role') !== undefined) {
            newElement.setAttribute('role', oldServiceDomElement.getAttribute('role'));
        }
        if (oldServiceDomElement.getAttribute('aria-label') !== undefined) {
            newElement.setAttribute('aria-label', oldServiceDomElement.getAttribute('aria-label'));
        }

        oldServiceDomElement.parentNode.replaceChild(newElement, oldServiceDomElement);
        this.sourceElement = newElement;

        this.sourceElement.classList.remove(this.options.service.name);
        this.sourceElement.className += `${this.#className('widget')}`;

        const button = interpolateStr(htmlSpan, {
            className: this.#className('button'),
            content: text,
        });

        const icon = interpolateStr(htmlSpan, {
            className: this.#className('icon'),
            content: wrapSVG(this.options.service.svgIconPath),
        });

        this.sourceElement.innerHTML = icon + button;
    }

    #resetCountersOnSameService(options) {
        // ToDo: needs rely on the rendered element
        const className = `.${config.prefix}counter`;
        const counters = findAll(className, this.sourceElement);
        extendWith(this.options, mergeToNew({ forceUpdate: false }, options));
        counters.forEach((node) => node.parentNode.removeChild(node));
    }

    #animate() {
        // Set up click event listener
        const completeUrl = this.#buildUrl(this.options);
        this.sourceElement.setAttribute('href', completeUrl);
        this.sourceElement.addEventListener('click', this.#shareClick(completeUrl).bind(this));

        if (this.isCountable()) {
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
        const counterElement = find(`.${config.name}__counter`, this.sourceElement);

        if (counterElement) {
            counterElement.parentNode.removeChild(counterElement);
        }

        const options = {
            className: this.#className('counter'),
            content: counterInt,
        };

        if (!counterInt && !this.options.zeroes) {
            options.className += ` ${config.prefix}counter_empty`;
            options.content = '';
        }
        // TODO: Shadow DOM here
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
     * Click event listener
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
}
export default LikelyButton;
