import { isBrowserEnv } from './utils';

const fakeWindow = {};

export const global = isBrowserEnv ? window : fakeWindow;

const div = isBrowserEnv ? document.createElement('div') : {};

/**
 * Wrap SVG coords from data object into SVG tag
 * @param {string} coords
 * @returns {string}
 */
export const wrapSVG = (coords) =>
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" ' +
    'viewBox="0 0 16 16"><path d="' + coords + '"/></svg>';

/**
 * Create node from HTML
 * @param {string} html
 * @returns {Node}
 */
export const createNode = (html) => {
    div.innerHTML = html;

    return div.children[0];
};

/**
 * Load JSONP script. It gets executed after the main one is finished.
 * @param {string} url
 */
export const loadJSONP = (url) => {
    const script = document.createElement('script');
    const head = document.head;

    script.type = 'text/javascript';
    script.src = url;

    head.appendChild(script);
    head.removeChild(script);
};

/**
 * Find first node by selector
 * @param {string} selector
 * @param {Node} [node]
 * @returns {Node}
 */
export const find = (selector, node) => (node || document).querySelector(selector);

/**
 * Find all nodes by selector
 * @param {string} selector
 * @param {Node} [node]
 * @returns {Node[]}
 */
export const findAll = (selector, node) => Array.prototype.slice.call((node || document).querySelectorAll(selector));
/**
 * Open the popup
 * @param {string} url
 * @param {string} winId
 * @param {number} width
 * @param {number} height
 * @returns {object | null}
 */
export const openPopup = (url, winId, width, height) => {
    const left = Math.round(screen.width / 2 - width / 2);
    let top = 0;

    if (screen.height > height) {
        top = Math.round(screen.height / 3 - height / 2);
    }

    const options = 'left=' + left +
        ',top=' + top +
        ',width=' + width +
        ',height=' + height +
        ',personalbar=0,toolbar=0,scrollbars=1,resizable=1';

    const win = window.open(url, winId, options);

    if (!win) {
        location.href = url;
        return null;
    }

    win.focus();

    return win;
};
