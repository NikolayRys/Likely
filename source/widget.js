var Button = require('./button');

var services = require('./services'),
    config   = require('./config'),
    utils    = require('./utils');

/**
 * Main widget view
 * 
 * @param {Node} container
 * @param {Object} options
 */
function Likely (container, options) {
    this.container = container;
    this.options = options; 
    
    this.init();
}

Likely.prototype = {
    /**
     * Initiate the social buttons widget
     */
    init: function () {
        this.countersLeft = 0;
        this.buttons = [];
        this.number = 0;
        
        utils.toArray(this.container.children)
             .forEach(this.addButton.bind(this));
        
        if (this.options.counters) {
            this.timer   = setTimeout(this.appear.bind(this), this.options.wait);
            this.timeout = setTimeout(this.ready.bind(this),  this.options.timeout);
        }
        else {
            this.appear();
        }
    },
    
    /**
     * Add a button
     * 
     * @param {Node} node
     */
    addButton: function (node) {
        var button = new Button(node, this, this.options);
        
        this.buttons.push(button);
        
        if (button.options.counterUrl) {
            this.countersLeft++;
        }
    },
    
    /**
     * Update the timer with URL
     * 
     * @param {Object} options
     */
    update: function (options) {
        if (
            options.forceUpdate || 
            options.url !== this.options.url
        ) {
            this.countersLeft = this.buttons.length;
            this.number = 0;
            
            this.buttons.forEach(function (button) { 
                button.update(options);
            });
        }
    },
    
    /**
     * Update counter
     * 
     * @param {Event} e
     * @param {String} service
     * @param {Number} counter
     */
    updateCounter: function (e, service, counter) {
        if (counter) {
            this.number += counter; 
        }
        
        this.countersLeft--;
        
        if (this.countersLeft === 0) {
            this.appear();
            this.ready();
        }
    },
    
    /**
     * Show the buttons with smooth animation
     */
    appear: function () {
        this.container.classList.add(config.name + "_visible");
    },
    
    /**
     * Get. Set. Ready.
     */
    ready: function () {
        if (this.timeout) {
            clearTimeout(this.timeout);
            
            this.container.classList.add(config.name + "_ready");
        }
    }
};

module.exports = Likely;