const bool = { yes: true, no: false };

/**
 * Simple $.each, only for objects
 *
 * @param {Object} object
 * @param {Function} callback
 */
export const each = (object, callback) => {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            callback(object[key], key);
        }
    }
};

/**
 * Convert array-like object to array
 *
 * @param {Object} arrayLike
 * @returns {Array}
 */
export const toArray = (arrayLike) => Array.prototype.slice.call(arrayLike);

/**
 * Merge given dictionaries (objects) into one object.
 * Iterates across the arguments.
 *
 * @returns {Object}
 */
export const merge = function () {
    const result = {};
    const args = Array.prototype.slice.call(arguments); // eslint-disable-line no-undef

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg) {
            for (const key in arg) {
                if (arg.hasOwnProperty(key)) {
                    result[key] = arg[key];
                }
            }
        }
    }

    return result;
};

/**
 * Extend one (target) object by other (subject)
 *
 * @param {Object} target
 * @param {Object} subject
 * @returns {Object} Extended target
 */
export const extend = (target, subject) => {
    for (const key in subject) {
        if (subject.hasOwnProperty(key)) {
            target[key] = subject[key];
        }
    }
    return target;
};

/**
 * Return node.dataset or plain object for IE 10without setters
 * based on https://gist.github.com/brettz9/4093766#file_html5_dataset.js
 *
 * @param {Node} node
 * @returns {Object}
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
        if (attribute && attribute.name && (/^data-\w[\w\-]*$/).test(attribute.name)) {
            attributeName = attribute.name.substr(5).replace(/-./g, toUpperCase);
            dataset[attributeName] = attribute.value;
        }
    }

    return dataset;
};

/**
 * Convert "yes" and "no" to true and false.
 *
 * @param {Node} node
 * @returns {Object}
 */
export const bools = (node) => {
    const result = {};
    const data = getDataset(node);

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];

            result[key] = bool[value] || value;
        }
    }

    return result;
};

/**
 * Map object keys in string to its values
 *
 * @param {String} text
 * @param {Object} data
 * @returns {String}
 */
export const template = (text, data) => {
    return text ? text.replace(/\{([^\}]+)\}/g, function (value, key) {
        return key in data ? data[key] : value;
    }) : '';
};

/**
 * Map object keys in URL to its values
 *
 * @param {String} text
 * @param {Object} data
 * @returns {String}
 */
export const makeUrl = (text, data) => {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            data[key] = encodeURIComponent(data[key]);
        }
    }

    return template(text, data);
};

/**
 * Create query string out of data
 *
 * @param {Object} data
 * @returns {String}
 */
export const query = (data) => {
    const filter = encodeURIComponent;
    const query = [];

    for (const key in data) {
        if (typeof data[key] === 'object') {
            continue;
        }

        query.push(`${filter(key)}=${filter(data[key])}`);
    }

    return query.join('&');
};

/**
 * Set value in object using dot-notation
 *
 * @param {Object} object
 * @param {String} key
 * @param {Object} value
 */
export const set = (object, key, value) => {
    const frags = key.split('.');
    let last = null;

    frags.forEach((key, index) => {
        if (typeof object[key] === 'undefined') {
            object[key] = {};
        }

        if (index !== frags.length - 1) {
            object = object[key];   // eslint-disable-line no-param-reassign
        }

        last = key;
    });

    object[last] = value;
};

/**
 * Returns default url for likely.
 * It could be href from <link rel='canonical'>
 * if presents in the document, or the current url of the page otherwise
 *
 * @returns {String}
 */
export const getDefaultUrl = () => {
    const link = document.querySelector('link[rel="canonical"]');

    if (link) {
        return link.href;
    }
    return window.location.href.replace(window.location.hash, '');
};
