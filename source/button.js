import { createNode, find, findAll, openPopup, wrapSVG } from './dom';
import { extendWith, getDataset, interpolateStr, interpolateUrl, mergeToNew, toArray } from './utils';

import config from './config';
import connectButtonToService from './connectButtonToService';
import services from './services';

const htmlSpan = '<span class="{className}">{content}</span>';

/**
 * Individual social link button with a counter
 * @param {Node} serviceDiv
 * @param {Likely} likelyWidget
 * @param {object} options
 */
class LikelyButton {
    constructor(likelyWidget, serviceDiv) {
        this.serviceDomElement = serviceDiv;
        this.likelyWidget = likelyWidget;
        this.options = mergeToNew(likelyWidget.options);
    }

    build() {
        this.detectService();
        if (this.isConnected()) {
            this.detectParams();
        }
    }


    /**
     * Whether the button was successfully connected to a service
     * @returns {boolean}
     */
    isConnected() {
        return this.options.service !== undefined;
    }

    /**
     * Make button ready for usage
     */
    prepare() {
        if (this.isConnected()) {
            this.initHtml();
            this.registerAsCounted();
        }
    }

    /**
     * Refresh the counter
     * @param {object} options
     */
    refresh(options) {
        const className = `.${config.prefix}counter`;
        const counters = findAll(className, this.serviceDomElement); // HERE
        extendWith(this.options, mergeToNew({ forceUpdate: false }, options));
        counters.forEach((node) => node.parentNode.removeChild(node));
        this.listenClick();
        this.registerAsCounted();
    }

    detectService() {
        const classes = toArray(this.serviceDomElement.classList);
        const serviceName = classes.find((className) => Object.prototype.hasOwnProperty.call(services, className));
        if (serviceName) {
            this.options.service = services[serviceName];
        }
    }

    /**
     * Merge params from data-* attributes into options hash map
     */
    detectParams() {
        const options = this.options;
        this.data = getDataset(this.serviceDomElement);
        if (this.data.counter) {
            options.staticCounter = this.data.counter;
        }
        if (this.data.url) {
            options.url = this.data.url;
        }
        if (this.data.title) {
            options.title = this.data.title;
        }
    }

    /**
     * Initiate button's HTML
     */
    initHtml() {
        const oldServiceDomElement = this.serviceDomElement;
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
        // TODO: build shadow root here
        this.serviceDomElement = newElement;
        const sde = this.serviceDomElement;

        sde.classList.remove(this.options.service.name);
        sde.className += `${this.className('widget')}`;

        this.listenClick();

        const button = interpolateStr(htmlSpan, {
            className: this.className('button'),
            content: text,
        });

        const icon = interpolateStr(htmlSpan, {
            className: this.className('icon'),
            content: wrapSVG(this.options.service.svgIconPath),
        });

        sde.innerHTML = icon + button;
    }

    listenClick() {
        const completeUrl = this.buildUrl(this.options);
        this.serviceDomElement.setAttribute('href', completeUrl);
        this.serviceDomElement.addEventListener('click', this.shareClick(completeUrl).bind(this));
    }

    /**
     * Perform fetching and displaying counter
     */
    registerAsCounted() {
        const opts = this.options;
        if (opts.counters && opts.service.counterUrl) {
            if (opts.staticCounter) {
                this.setDisplayedCounter(opts.staticCounter);
            }
            else {
                connectButtonToService(this.setDisplayedCounter.bind(this), opts);
            }
        }
    }

    /**
     * Combine a BEM-compliant classname
     * @param {string} className
     * @returns {string}
     */
    className(className) {
        const fullClass = config.prefix + className;

        return `${fullClass} ${fullClass}_${this.options.service.name}`;
    }

    /**
     * Set visible button counter to a value
     * @param {string} counterString
     */
    setDisplayedCounter(counterString) {
        const counterInt = parseInt(counterString, 10) || 0;
        const counterElement = find(`.${config.name}__counter`, this.serviceDomElement);

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
        // TODO: Shadow DOM here
        this.serviceDomElement.appendChild(createNode(interpolateStr(htmlSpan, options)));

        this.likelyWidget.reportReadiness();
    }

    /**
     * Construct URL for sharing
     * @param {object} options
     * @returns {string}
     */
    buildUrl(options) {
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
    shareClick(completeUrl) {
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
