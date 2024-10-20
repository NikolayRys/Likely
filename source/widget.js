import Button from './button';

import config from './config';
import { toArray } from './utils';
/**
 * Main widget view.
 * It serves as a container for all buttons and manages their rendering.
 * @param {Node} container
 * @param {object} options
 */
class Likely {
    constructor(container, options) {
        this.lightLikelyDiv = container;
        this.shadowContainer = null;  // ToDO: container for shadow DOM
        this.options = options;
        this.unprocessedCounters = 0;
        this.buttons = [];
    }

    renderButtons() {
        // ToDO: init shadow DOM
        // this.shadowContainer = this.lightLikelyDiv.attachShadow({ mode: 'open' });
        toArray(this.lightLikelyDiv.children).forEach(this.#addButton.bind(this));

        // Temporary partial visibility to prevent delays in rendering while we're waiting for counters
        this.lightLikelyDiv.classList.add(`${config.name}_visible`);
        if (this.options.counters) {
            this.readyDelay = setTimeout(this.ready.bind(this), this.options.timeout);
        }
        else {
            this.ready();
        }
        this.materializeButtons();
    }

    /**
     * Add a button, private method
     * @param {Node} serviceDiv
     */
    #addButton(serviceDiv) {
        const button = new Button(this, serviceDiv);
        if (button.isConnected()) {
            this.buttons.push(button);
            if (button.options.service.counterUrl) {
                this.unprocessedCounters++;
            }
        }
    }

    /**
     * Show all the buttons
     */
    materializeButtons() {
        this.buttons.forEach((button) => button.prepare());
    }

    /**
     * Refresh all the counters
     * @param {object} options
     */
    update(options) {
        if (
            options.forceUpdate ||
            options.url && options.url !== this.options.url
        ) {
            this.unprocessedCounters = this.buttons.length;

            this.buttons.forEach((button) => button.refresh(options));
        }
    }

    /**
     * Register the button as ready
     */
    finalize() {
        this.unprocessedCounters--;

        if (this.unprocessedCounters === 0) {
            clearTimeout(this.readyDelay);
            this.ready();
        }
    }

    /**
     * Display ready status
     */
    ready() {
        // Remove class_visible to prevent flickering
        this.lightLikelyDiv.classList.remove(`${config.name}_visible`);
        this.lightLikelyDiv.classList.add(`${config.name}_ready`);
    }
}

export default Likely;
