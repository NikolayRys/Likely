import Button from './button';

import config from './config';
import { toArray } from './utils';

/**
 * Main widget view
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
            this.readyDelay = setTimeout(this.ready.bind(this), this.options.timeout);
        }
        else {
            this.ready();
        }
        this.materializeButtons();
    }

    /**
     * Add a button
     * @param {Node} node
     */
    addButton(node) {
        const button = new Button(node, this, this.options);
        if (button.isConnected()) {
            this.buttons.push(button);
            if (button.options.service.counterUrl) {
                this.countersLeft++;
            }
        }
        else if (button.isUnrecognized()) {
            console.warn('A button without a valid service detected, please check button classes.');
        }
    }

    /**
     * Show all the buttons
     */
    materializeButtons() {
        this.buttons.forEach((button) => button.prepare());
    }

    /**
     * Refresh all the buttons
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
     * Register the button as ready
     */
    finalize() {
        this.countersLeft--;

        if (this.countersLeft === 0) {
            clearTimeout(this.readyDelay);
            this.ready();
        }
    }

    /**
     * Display ready status
     */
    ready() {
        this.container.classList.add(`${config.name}_ready`);
    }
}

export default Likely;
