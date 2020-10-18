import { createNode, createTempLink, find, findAll, openPopup, wrapSVG } from './dom';
import { extendWith, getDataset, interpolateStr, interpolateUrl, mergeToNew, joinIntoParams, toArray } from './utils';

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
        if (this.isRecognized()) {
            this.detectParams();
        }
    }

    /**
     * Whether the button was successfully connected to a service
     * @returns {Boolean}
     */
    isRecognized() {
        return this.options.service !== undefined;
    }

    /**
     * Make button ready for usage
     */
    prepare() {
        if (this.isRecognized()) {
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
    }

    /**
     * Merge params from data-* attributes into options hash map
     */
    detectParams() {
        const options = this.options;
        this.data = getDataset(this.widget);
        const unknownParams = [];

        for (const key in this.data) {
            // Array.prototype.indexOf() instead of Array.prototype.includes() for IE support
            if (this.options.service.knownParams.indexOf(key) === -1) {
                unknownParams.push(key);
            }
        }
        if (unknownParams.length > 0) {
            const unknownParamsStr = unknownParams.join(', ');
            console.warn('LIKELY DEPRECATION: unsupported parameters “%s” on “%s” button. They will be ignored in version 3.0.',
                unknownParamsStr, this.options.service.name);
        }

        if (this.data.counter) {
            options.staticCounter = this.data.counter;
        }
        options.url = this.data.url || options.url;
        options.title = this.data.title || options.title;

        // Removing params with special meaning.
        // Temporary measure until 3.0: instead of deleting, don't do bulk param assignment with addAdditionalParamsToUrl
        delete this.data.counter;
        delete this.data.url;
        delete this.data.title;
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

        if (options.service.clickCallback.call(this)) {
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
     * @param {String} url
     * @returns {String}
     */
    addAdditionalParamsToUrl(url) {
        const parameters = joinIntoParams(this.data);
        const delimeter = url.indexOf('?') === -1 ? '?' : '&';
        return parameters === ''
            ? url
            : url + delimeter + parameters;
    }
}

export default LikelyButton;
