import Button from './button';
import config from './config';
import { toArray } from './utils';
/**
 * Main widget view.
 * It serves as a container for all buttons and manages their rendering.
 * @param {Node} container
 * @param {object} options
 */
export default class Likely {
    #options;
    #sourceLikelyDiv;
    #shadowRoot;
    #shadowLikelyDiv;
    #awaitedButtons;
    #readyDelay;
    #buttons;

    constructor(container, options) {
        this.#options = options;
        this.#sourceLikelyDiv = container;
        this.#shadowRoot = null;
        this.#shadowLikelyDiv = null;
        this.#awaitedButtons = 0;
        this.#readyDelay = null;
        this.#buttons = [];
    }

    // Main method that initializes the widget
    renderButtons() {
        // this.#shadowRoot = this.#sourceLikelyDiv.attachShadow({ mode: 'open' });
        this.#shadowLikelyDiv = document.createElement('div');
        //this.#shadowRoot.appendChild(this.shadowLikelyDiv);

        toArray(this.#sourceLikelyDiv.children).forEach(this.#addButton.bind(this));

        // Temporary partial visibility to prevent delays in rendering while we're waiting for counters
        this.#sourceLikelyDiv.classList.add(`${config.name}_visible`);
        if (this.#options.counters) {
            this.#readyDelay = setTimeout(this.#ready.bind(this), this.#options.timeout);
        }
        else {
            this.#ready();
        }
        this.#materializeButtons();
    }

    /**
     * Refresh all the counters
     * Can be used repeatedly after the widget was initialized with renderButtons
     * @param {object} options
     */
    update(options) {
        if (
            options.forceUpdate ||
            options.url && options.url !== this.#options.url
        ) {
            this.#awaitedButtons = this.#buttons.length;
            this.#buttons.forEach((button) => button.update(options));
        }
    }

    /**
     * Buttons use it to report that they were successfully connected to the service for counters,
     * and now they ready to be displayed
     */
    #reportReadiness() {
        this.#awaitedButtons--;
        if (this.#awaitedButtons === 0) {
            clearTimeout(this.#readyDelay);
            this.#ready();
        }
    }

    /**
     * Display ready status
     */
    #ready() {
        // Remove class_visible to prevent flickering
        this.#sourceLikelyDiv.classList.remove(`${config.name}_visible`);
        this.#sourceLikelyDiv.classList.add(`${config.name}_ready`);
    }

    /**
     * Add a button, private method
     * @param {Node} serviceDiv
     */
    #addButton(serviceDiv) {
        const button = new Button(serviceDiv, this.#options, this.#reportReadiness.bind(this));
        if (button.readParams()) {
            this.#buttons.push(button);
            this.#awaitedButtons++;
        }
    }
    /**
     * Show all the buttons
     */
    #materializeButtons() {
        this.#buttons.forEach((button) => button.materialize());
    }
}
