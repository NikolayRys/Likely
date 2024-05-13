const bool = { yes: true, no: false };
/**
 * Convert array-like object to array (for example DOMTokenList)
 * @param {object} arrayLike
 * @returns {Array}
 */
export const toArray = (arrayLike) => Array.prototype.slice.call(arrayLike);

/**
 * Merge given dictionaries (objects) into one object.
 * Iterates across the arguments, the last one gets priority.
 * @returns {object}
 */
export const mergeToNew = function () {
    const newObject = {};
    const args = Array.prototype.slice.call(arguments);

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg) {
            for (const key in arg) {
                if (Object.prototype.hasOwnProperty.call(arg, key)) {
                    newObject[key] = arg[key];
                }
            }
        }
    }

    return newObject;
};

/**
 * Extend one (target) object by other (subject)
 * @param {object} target
 * @param {object} subject
 * @returns {object} Extended target
 */
export const extendWith = (target, subject) => {
    for (const key in subject) {
        if (Object.prototype.hasOwnProperty.call(subject, key)) {
            target[key] = subject[key];
        }
    }
    return target;
};

/**
 * Return node.dataset or plain object for IE10 without setters
 * based on https://gist.github.com/brettz9/4093766#file_html5_dataset.js
 * @param {Node} node
 * @returns {object}
 */
export const getDataset = (node) => {
    if (typeof node.dataset === 'object') {
        return node.dataset;
    }

    let i;
    const dataset = {};
    const attributes = node.attributes;
    let attribute;
    let attributeName;

    const toUpperCase = (n0) => n0.charAt(1).toUpperCase();

    for (i = attributes.length - 1; i >= 0; i--) {
        attribute = attributes[i];
        if (attribute && attribute.name && (/^data-\w[\w-]*$/).test(attribute.name)) {
            attributeName = attribute.name.substr(5).replace(/-./g, toUpperCase);
            dataset[attributeName] = attribute.value;
        }
    }

    return dataset;
};

/**
 * Convert "yes" and "no" to true and false.
 * @param {Node} node
 * @returns {object}
 */
export const getBools = (node) => {
    const result = {};
    const data = getDataset(node);

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];

            result[key] = (value in bool) ? bool[value] : value;
        }
    }

    return result;
};

/**
 * Map object keys in string to its values
 * @param {string} text
 * @param {object} data
 * @returns {string}
 */
export const interpolateStr = (text, data) => {
    return text ? text.replace(/\{([^}]+)}/g, function (value, key) {
        return key in data ? data[key] : value;
    }) : '';
};

/**
 * Map object keys in URL to its values
 * @param {string} text
 * @param {object} data
 * @returns {string}
 */
export const interpolateUrl = (text, data) => {
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            data[key] = encodeURIComponent(data[key]);
        }
    }
    return interpolateStr(text, data);
};
/**
 * Set value in object using dot-notation
 * @param {string} key
 * @param {object} value
 */
export const registerGlobalCallback = (key, value) => {
    const frags = key.split('.');
    let last = null;
    let object = global;

    frags.forEach((key, index) => {
        if (typeof object[key] === 'undefined') {
            object[key] = {};
        }

        if (index !== frags.length - 1) {
            object = object[key];
        }

        last = key;
    });

    object[last] = value;
};

/**
 * Returns default url for likely.
 * It could be href from <link rel='canonical'>
 * if presents in the document, or the current url of the page otherwise
 * @returns {string}
 */
export const getDefaultUrl = () => {
    const link = document.querySelector('link[rel="canonical"]');

    if (link) {
        return link.href;
    }
    return window.location.href.replace(window.location.hash, '');
};

/**
 * Is code run in browser or on server.
 */
export const isBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined' && document.createElement;

/**
 * Renames a key in an object, using ES6 syntax
 * @param {object} obj
 * @param {string} oldKey
 * @param {string} newKey
 */
export const renameKey = (obj, oldKey, newKey) => {
    if (Object.prototype.hasOwnProperty.call(obj, oldKey)) {
        delete Object.assign(obj, { [newKey]: obj[oldKey] })[oldKey];
    }
};

/**
 * Check if the browser is Internet Explorer
 * @returns {boolean}
 */
export const isInternetExplorer = () => {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE '); // For IE 10 or older
    const trident = ua.indexOf('Trident/'); // For IE 11

    return (msie > 0 || trident > 0);
};
