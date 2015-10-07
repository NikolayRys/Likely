var promises = require('./promises'),
    services = require('./services'),
    config   = require('./config'),
    utils    = require('./utils'),
    dom      = require('./dom');

var html = {
    options: 'left={left},top={top},width={width},height={height},'
           + 'personalbar=0,toolbar=0,scrollbars=1,resizable=1',
    span:    '<span class="{className}">{content}</span>',
    link:    '<a href="{href}"></a>'
};

/**
 * Separate social link widget
 * 
 * @param {jQuery} widget
 * @param {Object} options
 */
function LikelyButton (widget, options) {
    this.widget  = widget;
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
        this.initHtml();
    
        setTimeout(this.initCounter.bind(this), 0);
    },
    
    /**
     * Update the counter
     * 
     * @param {Object} options
     */
    update: function (options) {
        var className = "." + config.prefix + "counter";
            counters  = dom.findAll(className, this.widget);
        
        utils.extend(this.options, utils.merge({forceUpdate: false}, options));
        utils.toArray(counters).forEach(function (node) {
            node.parentNode.removeChild(node);
        });
        
        this.initCounter();
    },
    
    /**
     * Get the config.name of service and its options
     */
    detectService: function () {
        var service = this.widget.dataset.service;
        
        if (!service) {
            var classes = this.widget.className.split(" ");
            
            for (var i = 0; i < classes.length; i++) {
                if (classes[i] in services) break;
            }
            
            service = classes[i];
        }
        
        if (service) {
            this.service = service;
        
            utils.extend(this.options, services[service]);
        }
    },
    
    /**
     * Merge params from node.dataset into options hash map
     */
    detectParams: function () {
        var data = this.widget.dataset;
        
        if (data.counter) {
            var counter = parseInt(data.counter, 10);
            
            if (isNaN(counter)) {
                this.options.counterUrl = data.counter;
            }
            else {
                this.options.counterNumber = counter;
            }
        }
        
        if (data.title) {
            this.options.title = data.title;
        }
        
        if (data.url) {
            this.options.url = data.url;
        }
    },
    
    initHtml: function () {
        var options = this.options,
            widget  = this.widget,
            text    = widget.innerHTML;
        
        if (options.clickUrl) {
            this.widget = widget = this.createLink(widget, options);
        } 
        else {
            widget.addEventListener("click", this.click.bind(this));
        }
        
        widget.classList.remove(this.service)
        widget.className += (" " + this.getElementClassNames("widget"));
        
        var button = utils.template(html.span, {
            className: this.getElementClassNames("button"),
            content:   text
        });
        
        var icon = utils.template(html.span, {
            className: this.getElementClassNames("icon"),
            content:   dom.wrapSVG(options.svgi)
        });
        
        widget.innerHTML = icon + button;
    },
    
    createLink: function (widget, options) {
        var url = utils.makeUrl(options.clickUrl, {
            title: options.title,
            url:   options.url
        });
        
        var link = dom.createNode(utils.template(span.link, {
            href: url
        }));
        
        this.cloneDataAttrs(widget, link); 
        
        widget.parentNode.replaceChild(link, widget);
        
        return link;
    },
    
    /**
     * Fetch or get cached counter value and update the counter
     */
    initCounter: function () {
        if (this.options.counters && this.options.counterNumber) {
            this.updateCounter(this.options.counterNumber);
        }
        else {
            promises
                .fetch(
                    this.service, 
                    this.options.url,
                    {
                        counterUrl:  this.options.counterUrl,
                        forceUpdate: this.options.forceUpdate
                    }
                ).always(this.updateCounter.bind(this))
        }
    },
    
    /**
     * Clone data attributes from one node to another
     * 
     * @param {Node} a
     * @param {Node} b
     */
    cloneDataAttrs: function (a, b) {
        var data = a.dataset;
        
        for (var i in a) {
            if (data.hasOwnProperty(i)) {
                b.dataset[i] = a[i];
            }
        }
    },
    
    /**
     * @param {String} className
     * @return {String}
     */
    getElementClassNames: function (className) {
        return utils.likelyClass(className, this.service);
    },
    
    /**
     * Update counter
     * 
     * @param {String} e
     */
    updateCounter: function (counter) {
        counter = parseInt(counter, 10) || 0;
        
        var options = {
            className: this.getElementClassNames("counter"),
            content:   counter
        };
        
        if (!counter && !this.options.zeroes) {
            options.className += " " + config.prefix + "counter_empty";
            options.content = "";
        }
        
        this.widget.appendChild(
            dom.createNode(utils.template(html.span, options))
        );
    },
    
    /**
     * @param {Event} e
     */
    click: function (e) {
        var options = this.options,
            click   = typeof options.click === "function" 
                ? options.click.call(this, e) 
                : true;
        
        if (click) {
            var url = utils.makeUrl(options.popupUrl, {
                url:   options.url,
                title: options.title
            });
            
            this.openPopup(this.addAdditionalParamsToUrl(url), {
                width:  options.popupWidth,
                height: options.popupHeight
            });
        }
        
        return false;
    },
    
    /**
     * Append service data to URL
     * 
     * @param {String} url
     */
    addAdditionalParamsToUrl: function (url) {
        var parameters = utils.query(utils.merge(this.widget.dataset, this.options.data)),
            delimeter  = url.indexOf("?") === -1 ? "?" : "&";
        
        if (parameters  === '') {
            return url;
        }
        
        return url + delimeter + parameters;
    },
    
    /**
     * Open the popup
     * 
     * @param {String} url
     * @param {Object} options
     */
    openPopup: function (url, options) {
        var left = Math.round(screen.width / 2 - options.width / 2),
            top  = 0;
        
        if (screen.height > options.height) {
            top = Math.round(screen.height / 3 - options.height / 2);
        }
        
        var win = window.open(url, "sl_" + this.service, utils.template(html.options, {
            height: options.height,
            width:  options.width,
            left:   left,
            top:    top
        }));
        
        if (!win) {
            return location.href = url;
        }
        
        this.watchWindow(win);
    },
    
    /**
     * Poll the state of the window.
     * 
     * On open, trigger popup open event. 
     * On close, trigger popup event event. 
     * 
     * @param {Window} win
     */
    watchWindow: function (win) {
        if (!win) {
            return;
        }
        
        win.focus();
    }
};

module.exports = LikelyButton;