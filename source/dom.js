const div = document.createElement('div');
let gid = 0;

/**
 * Wrap SVG coords from data object into SVG tag
 *
 * @param {String} coords
 * @returns {String}
 */
export const wrapSVG = (coords) =>
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" ' +
  'viewBox="0 0 16 16"><path d="M' +
  coords +
  'z"/></svg>';

/**
 * Create node from HTML
 *
 * @param {String} html
 * @returns {Node}
 */
export const createNode = (html) => {
    div.innerHTML = html;

    return div.children[0];
};

/**
 * Load script
 *
 * @param {String} url
 */
export const getScript = (url) => {
    const script = document.createElement('script');
    const head = document.head;

    script.type = 'text/javascript';
    script.src = url;

    head.appendChild(script);
    head.removeChild(script);
};

/**
 * Get JSON
 *
 * @param {String} url
 * @param {Function} callback
 */
export const getJSON = (url, callback) => {
    const name = encodeURIComponent(`random_fun_${++gid}`);

    const concreteUrl = url.replace(
        /callback=(\?)/,
        `callback=${name}`
    );

    window[name] = callback;

    getScript(concreteUrl);
};

/**
 * Find first node by selector
 *
 * @param {String} selector
 * @param {Node} [node]
 * @returns {Node}
 */
export const find = (selector, node) => (node || document).querySelector(selector);

/**
 * Find all nodes by selector
 *
 * @param {String} selector
 * @param {Node} [node]
 * @returns {Node[]}
 */
export const findAll = (selector, node) => Array.prototype.slice.call((node || document).querySelectorAll(selector));
/**
 * Open the popup
 *
 * @param {String} url
 * @param {String} winId
 * @param {Number} width,
 * @param {Number} height
 * @returns {Object|null}
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
