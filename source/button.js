'use strict';

var services = require('./services');
var config = require('./config');
var fetch = require('./fetch');
var utils = require('./utils');
var dom = require('./dom');

var htmlSpan = '<span class="{className}">{content}</span>';

/**
 * Separate social link widget
 *
 * @param {Node} widget
 * @param {Likely} likely
 * @param {Object} options
 */
function LikelyButton(widget, likely, options) {
    this.widget = widget;
    this.likely = likely;
    this.options = utils.merge(options);

    this.init();
}

LikelyButton.prototype = {
    /**
     * Initiate the button
     */
    init: function () {
        this.detectService();
        this.detectParams();

        if (this.service) {
            this.initHtml();

            setTimeout(this.initCounter.bind(this), 0);
        }
    },

    /**
     * Update the counter
     *
     * @param {Object} options
     */
    update: function (options) {
        var className = '.' + config.prefix + 'counter';
        var counters = dom.findAll(className, this.widget);

        utils.extend(this.options, utils.merge({ forceUpdate: false }, options));
        utils.toArray(counters).forEach(function (node) {
            node.parentNode.removeChild(node);
        });

        this.initCounter();
    },

    /**
     * Get the config.name of service and its options
     */
    detectService: function () {
        var widget = this.widget;
        var service = utils.getDataset(widget).service;

        if (!service) {
            service = Object.keys(services).filter(function (service) {
                return widget.classList.contains(service);
            })[0];
        }

        if (service) {
            this.service = service;

            utils.extend(this.options, services[service]);
        }
    },

    /**
     * Merge params from data-* attributes into options hash map
     */
    detectParams: function () {
        var options = this.options;
        var data = utils.getDataset(this.widget);

        if (data.counter) {
            var counter = parseInt(data.counter, 10);

            if (isNaN(counter)) {
                options.counterUrl = data.counter;
            }
            else {
                options.counterNumber = counter;
            }
        }

        options.title = data.title || options.title;
        options.url = data.url || options.url;
    },

    /**
     * Inititate button's HTML
     */
    initHtml: function () {
        var options = this.options;
        var widget = this.widget;
        var text = widget.innerHTML;

        widget.addEventListener('click', this.click.bind(this));
        widget.classList.remove(this.service);
        widget.className += (' ' + this.className('widget'));

        var button = utils.template(htmlSpan, {
            className: this.className('button'),
            content: text,
        });

        var icon = utils.template(htmlSpan, {
            className: this.className('icon'),
            content: dom.wrapSVG(options.svgi),
        });

        widget.innerHTML = icon + button;
    },

    /**
     * Fetch or get cached counter value and update the counter
     */
    initCounter: function () {
        var options = this.options;

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
    },

    /**
     * @param {String} className
     * @returns {String}
     */
    className: function (className) {
        var fullClass = config.prefix + className;

        return fullClass + ' ' + fullClass + '_' + this.service;
    },

    /**
     * Update counter
     *
     * @param {String} counterString
     */
    updateCounter: function (counterString) {
        var counter = parseInt(counterString, 10) || 0;

        var counterElement = dom.find('.' + config.name + '__counter', this.widget);

        if (counterElement) {
            counterElement.parentNode.removeChild(counterElement);
        }

        var options = {
            className: this.className('counter'),
            content: counter,
        };

        if (!counter && !this.options.zeroes) {
            options.className += ' ' + config.prefix + 'counter_empty';
            options.content = '';
        }

        this.widget.appendChild(
            dom.createNode(utils.template(htmlSpan, options))
        );

        this.likely.updateCounter(this.service, counter);
    },

    /**
     * Click event listener
     * @returns {Boolean}
     */
    click: function () {
        var options = this.options;

        if (options.click.call(this)) {
            var url = utils.makeUrl(options.popupUrl, {
                url: options.url,
                title: options.title,
            });

            dom.openPopup(
                this.addAdditionalParamsToUrl(url),
                config.prefix + this.service,
                options.popupWidth,
                options.popupHeight
            );
        }

        return false;
    },

    /**
     * Append service data to URL
     *
     * @param {String} url
     * @returns {String}
     */
    addAdditionalParamsToUrl: function (url) {
        var parameters = utils.query(utils.merge(this.widget.dataset, this.options.data));
        var delimeter = url.indexOf('?') === -1 ? '?' : '&';

        return parameters === ''
            ? url
            : url + delimeter + parameters;
    },
};

module.exports = LikelyButton;
