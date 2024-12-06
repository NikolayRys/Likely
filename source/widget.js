import Button from './button';
import config from './config';
import cssText from './shadow.styl';
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
        this.#setupShadowDom();
        toArray(this.#sourceLikelyDiv.children).forEach(this.#addButton.bind(this));
        // Temporary partial visibility to prevent delays in rendering while we're waiting for counters
        this.#shadowLikelyDiv.classList.add(`${config.name}_visible`);
        if (this.#options.counters) {
            this.#readyDelay = setTimeout(this.#ready.bind(this), this.#options.timeout);
        }
        else {
            this.#ready();
        }
        this.#showButtons();
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

    #setupShadowDom() {
        this.#shadowRoot = this.#sourceLikelyDiv.attachShadow({ mode: 'open' });
        const styleElement = document.createElement('style');
        styleElement.textContent = cssText;
        this.#shadowRoot.appendChild(styleElement);
        this.#shadowLikelyDiv = document.createElement('div');
        this.#shadowLikelyDiv.classList.add(...this.#sourceLikelyDiv.classList);
        this.#shadowRoot.appendChild(this.#shadowLikelyDiv);
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
        this.#shadowLikelyDiv.classList.remove(`${config.name}_visible`);
        this.#shadowLikelyDiv.classList.add(`${config.name}_ready`);
    }

    /**
     * Add a button, private method
     * @param {Node} sourceElement
     */
    #addButton(sourceElement) {
        const button = new Button(sourceElement, this.#options, this.#reportReadiness.bind(this));
        if (button.setService()) {
            this.#awaitedButtons++;
            this.#buttons.push(button);
            button.build();
        }
    }
    /**
     * Show all the buttons
     */
    #showButtons() {
        this.#buttons.forEach((button) => this.#shadowLikelyDiv.appendChild(button.renderedElement));
    }
}
