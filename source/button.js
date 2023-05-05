import { createNode, find, findAll, openPopup, wrapSVG } from './dom';
import { extendWith, getDataset, interpolateStr, interpolateUrl, mergeToNew, toArray } from './utils';

import config from './config';
import connectButtonToService from './connectButtonToService';
import services from './services';

const htmlSpan = '<span class="{className}">{content}</span>';

/**
 * Separate social link widget
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
        if (this.isConnected()) {
            this.detectParams();
        }
    }

    /**
     * Whether the button was successfully connected to a service
     * @returns {Boolean}
     */
    isConnected() {
        return this.options.service !== undefined;
    }

    /**
     * If purpose of the buttond
     * @returns {Boolean}
     */
    isUnrecognized() {
        return !this.isConnected() && !this.options.foreign;
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
     * Update the counter
     * @param {Object} options
     */
    update(options) {
        const className = `.${config.prefix}counter`;
        const counters = findAll(className, this.widget);
        extendWith(this.options, mergeToNew({ forceUpdate: false }, options));
        counters.forEach((node) => {
            node.parentNode.removeChild(node);
        });
        this.wireClick();
        this.registerAsCounted();
    }

    /**
     * Attach a service based on given button classes
     */
    detectService() {
        const classes = toArray(this.widget.classList);
        // Array.prototype.filter()[0] instead of Array.prototype.find() for IE support
        const serviceName = classes.filter((className) => Object.prototype.hasOwnProperty.call(services, className))[0];
        if (serviceName) {
            this.options.service = services[serviceName];
        }
        else if (classes.includes('likely__widget')) {
            this.options.foreign = true;
        }
    }

    /**
     * Merge params from data-* attributes into options hash map
     */
    detectParams() {
        const options = this.options;
        this.data = getDataset(this.widget);
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
        const oldWidget = this.widget;
        const text = oldWidget.innerHTML;

        // Rebuilding widget tag from div to <a>
        const newWidget = document.createElement('a');
        newWidget.innerHTML = oldWidget.innerHTML;
        newWidget.className = oldWidget.className;

        // Preserve accessibility attributes
        if (oldWidget.getAttribute('role') !== undefined) {
            newWidget.setAttribute('role', oldWidget.getAttribute('role'));
        }
        if (oldWidget.getAttribute('aria-label') !== undefined) {
            newWidget.setAttribute('aria-label', oldWidget.getAttribute('aria-label'));
        }

        oldWidget.parentNode.replaceChild(newWidget, oldWidget);
        this.widget = newWidget;
        const widget = this.widget;

        widget.classList.remove(this.options.service.name);
        widget.className += `${this.className('widget')}`;

        this.wireClick();

        const button = interpolateStr(htmlSpan, {
            className: this.className('button'),
            content: text,
        });

        const icon = interpolateStr(htmlSpan, {
            className: this.className('icon'),
            content: wrapSVG(this.options.service.svgIconPath),
        });

        widget.innerHTML = icon + button;
    }

    wireClick() {
        const completeUrl = this.buildUrl(this.options);
        this.widget.setAttribute('href', completeUrl);
        this.widget.addEventListener('click', this.shareClick(completeUrl).bind(this));
    }

    /**
     * Perform fetching and displaying counter
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
     * Combine a BEM-compliant classname
     * @param {String} className
     * @returns {String}
     */
    className(className) {
        const fullClass = config.prefix + className;

        return `${fullClass} ${fullClass}_${this.options.service.name}`;
    }

    /**
     * Set visible button counter to a value
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

        this.widget.appendChild(createNode(interpolateStr(htmlSpan, options)));

        this.likely.finalize();
    }

    /**
     * Construct URL for sharing
     * @param {Object} options
     * @returns {String}
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
     * @param {String} completeUrl
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
