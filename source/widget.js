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

        if (!likely.deprecationShown) {
            console.warn('LIKELY DEPRECATION FOR 3.0: Class "likely_visible" will be removed and joined with likely_ready. ' +
                'Button tags will be changed from <div> to <button>.');
            likely.deprecationShown = true;
        }

        toArray(this.container.children).forEach(this.addButton.bind(this));

        this.appear();
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
     *
     * @param {Node} node
     */
    addButton(node) {
        const button = new Button(node, this, this.options);
        if (button.isRecognized()) {
            this.buttons.push(button);
            if (button.options.service.counterUrl) {
                this.countersLeft++;
            }
        }
        else {
            console.warn('A button without a valid service detected, please check button classes.');
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
            clearTimeout(this.readyDelay);
            this.ready();
        }
    }

    /**
     * @deprecated Will be deleted in version 3.0, and joined with likely_ready
     * Show the buttons with smooth animation
     */
    appear() {
        this.container.classList.add(`${config.name}_visible`);
    }

    /**
     * Get. Set. Ready.
     */
    ready() {
        this.container.classList.add(`${config.name}_ready`);
    }
}

export default Likely;
