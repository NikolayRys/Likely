import Button from './button';

import config from './config';
import { toArray } from './utils';

/**
 * Main widget view
 *
 * @param {Node} container
 * @param {Object} options
 */
class Likely {
    constructor(container, options) {
        this.container = container;
        this.options = options;

        this.countersLeft = 0;
        this.buttons = [];

        toArray(this.container.children).forEach(this.addButton.bind(this));

        if (this.options.counters) {
            this.appearDelay = setTimeout(this.appear.bind(this), this.options.wait);
            this.readyDelay = setTimeout(this.ready.bind(this), this.options.timeout);
        }
        else {
            this.appear();
            this.ready();
        }
        this.materializeButtons();
    }

    /**
     * Add a button
     *
     * @param {Node} node
     */
    addButton(node) {
        const button = new Button(node, this, this.options);

        this.buttons.push(button);

        if (button.options.counterUrl) {
            this.countersLeft++;
        }
    }

    materializeButtons() {
        this.buttons.forEach((button) => button.prepare());
    }

    /**
     * Update the timer with URL
     *
     * @param {Object} options
     */
    update(options) {
        if (
            options.forceUpdate ||
            options.url && options.url !== this.options.url
        ) {
            this.countersLeft = this.buttons.length;

            this.buttons.forEach((button) => {
                button.update(options);
            });
        }
    }

    /**
     * Mark the button as done
     */
    finalize() {
        this.countersLeft--;

        if (this.countersLeft === 0) {
            this.appear();
            this.ready();
        }
    }

    /**
     * @deprecated Will be deleted in version 3.0, and joined with likely_ready
     * Show the buttons with smooth animation
     */
    appear() {
        clearTimeout(this.appearDelay);
        this.container.classList.add(`${config.name}_visible`);
        console.warn('DEPRECATION: "likely_visible" class will be removed in 3.0 and joined with likely_ready');
    }

    /**
     * Get. Set. Ready.
     */
    ready() {
        clearTimeout(this.readyDelay);
        this.container.classList.add(`${config.name}_ready`);
    }
}

export default Likely;
