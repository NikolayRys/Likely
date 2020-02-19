/*!
 * Likely 2.4.0 by Ilya Birman (ilyabirman.net)
 * Rewritten sans jQuery by Evgeny Steblinsky (volter9.github.io)
 * Supported by Ivan Akulov (iamakulov.com), Viktor Karpov (https://twitter.com/vitkarpov),
 * Nikolay Rys (linkedin.com/in/nikolay-rys) and contributors
 * Inspired by Social Likes by Artem Sapegin (sapegin.me)
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["likely"] = factory();
	else
		root["likely"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "each", function() { return each; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toArray", function() { return toArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "merge", function() { return merge; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extend", function() { return extend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDataset", function() { return getDataset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bools", function() { return bools; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "template", function() { return template; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeUrl", function() { return makeUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "query", function() { return query; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set", function() { return set; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDefaultUrl", function() { return getDefaultUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isBrowserEnv", function() { return isBrowserEnv; });
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var bool = { yes: true, no: false };

/**
 * Simple $.each, only for objects
 *
 * @param {Object} object
 * @param {Function} callback
 */
var each = function each(object, callback) {
    for (var key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
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
var toArray = function toArray(arrayLike) {
    return Array.prototype.slice.call(arrayLike);
};

/**
 * Merge given dictionaries (objects) into one object.
 * Iterates across the arguments.
 *
 * @returns {Object}
 */
var merge = function merge() {
    var result = {};
    var args = Array.prototype.slice.call(arguments); // eslint-disable-line no-undef

    for (var i = 0; i < args.length; i++) {
        var arg = args[i];

        if (arg) {
            for (var key in arg) {
                if (Object.prototype.hasOwnProperty.call(arg, key)) {
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
var extend = function extend(target, subject) {
    for (var key in subject) {
        if (Object.prototype.hasOwnProperty.call(subject, key)) {
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
var getDataset = function getDataset(node) {
    if (_typeof(node.dataset) === 'object') {
        return node.dataset;
    }

    var i = void 0;
    var dataset = {};
    var attributes = node.attributes;
    var attribute = void 0;
    var attributeName = void 0;

    var toUpperCase = function toUpperCase(n0) {
        return n0.charAt(1).toUpperCase();
    };

    for (i = attributes.length - 1; i >= 0; i--) {
        attribute = attributes[i];
        if (attribute && attribute.name && /^data-\w[\w-]*$/.test(attribute.name)) {
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
var bools = function bools(node) {
    var result = {};
    var data = getDataset(node);

    for (var key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            var value = data[key];

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
var template = function template(text, data) {
    return text ? text.replace(/\{([^}]+)\}/g, function (value, key) {
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
var makeUrl = function makeUrl(text, data) {
    for (var key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
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
var query = function query(data) {
    var filter = encodeURIComponent;
    var query = [];

    for (var key in data) {
        if (_typeof(data[key]) === 'object') {
            continue;
        }

        query.push(filter(key) + '=' + filter(data[key]));
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
var set = function set(object, key, value) {
    var frags = key.split('.');
    var last = null;

    frags.forEach(function (key, index) {
        if (typeof object[key] === 'undefined') {
            object[key] = {};
        }

        if (index !== frags.length - 1) {
            object = object[key]; // eslint-disable-line no-param-reassign
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
var getDefaultUrl = function getDefaultUrl() {
    var link = document.querySelector('link[rel="canonical"]');

    if (link) {
        return link.href;
    }
    return window.location.href.replace(window.location.hash, '');
};

/**
 * Is code run in browser or on server.
 */
var isBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined' && document.createElement;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "global", function() { return global; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wrapSVG", function() { return wrapSVG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNode", function() { return createNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getScript", function() { return getScript; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getJSON", function() { return getJSON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "find", function() { return find; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findAll", function() { return findAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openPopup", function() { return openPopup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createTempLink", function() { return createTempLink; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);


var fakeWindow = {};

var global = __WEBPACK_IMPORTED_MODULE_0__utils__["isBrowserEnv"] ? window : fakeWindow;

var div = __WEBPACK_IMPORTED_MODULE_0__utils__["isBrowserEnv"] ? document.createElement('div') : {};
var gid = 0;

/**
 * Storage for callbacks which are needed
 * for JSONP API of social networks
 */
global.__likelyCallbacks = {};

/**
 * Wrap SVG coords from data object into SVG tag
 *
 * @param {String} coords
 * @returns {String}
 */
var wrapSVG = function wrapSVG(coords) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" ' + 'viewBox="0 0 16 16"><path d="M' + coords + 'z"/></svg>';
};

/**
 * Create node from HTML
 *
 * @param {String} html
 * @returns {Node}
 */
var createNode = function createNode(html) {
    div.innerHTML = html;

    return div.children[0];
};

/**
 * Load script
 *
 * @param {String} url
 */
var getScript = function getScript(url) {
    var script = document.createElement('script');
    var head = document.head;

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
var getJSON = function getJSON(url, callback) {
    var name = encodeURIComponent('random_fun_' + ++gid);

    var concreteUrl = url.replace(/callback=(\?)/, 'callback=__likelyCallbacks.' + name);

    global.__likelyCallbacks[name] = callback;

    getScript(concreteUrl);
};

/**
 * Find first node by selector
 *
 * @param {String} selector
 * @param {Node} [node]
 * @returns {Node}
 */
var find = function find(selector, node) {
    return (node || document).querySelector(selector);
};

/**
 * Find all nodes by selector
 *
 * @param {String} selector
 * @param {Node} [node]
 * @returns {Node[]}
 */
var findAll = function findAll(selector, node) {
    return Array.prototype.slice.call((node || document).querySelectorAll(selector));
};
/**
 * Open the popup
 *
 * @param {String} url
 * @param {String} winId
 * @param {Number} width,
 * @param {Number} height
 * @returns {Object|null}
 */
var openPopup = function openPopup(url, winId, width, height) {
    var left = Math.round(screen.width / 2 - width / 2);
    var top = 0;

    if (screen.height > height) {
        top = Math.round(screen.height / 3 - height / 2);
    }

    var options = 'left=' + left + ',top=' + top + ',width=' + width + ',height=' + height + ',personalbar=0,toolbar=0,scrollbars=1,resizable=1';

    var win = window.open(url, winId, options);

    if (!win) {
        location.href = url;
        return null;
    }

    win.focus();

    return win;
};
/**
 * Creates a temporary anchor element, click on it and destroys it.
 * Used for buttons that do not have sharing popups
 *
 * @param {String} url
 */
var createTempLink = function createTempLink(url) {
    var anchor = document.createElement('a');

    anchor.href = url;
    anchor.style = 'display: none';
    document.body.appendChild(anchor);

    setTimeout(function () {
        anchor.click();
        document.body.removeChild(anchor);
    });
};

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * Configuration
 */

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'likely',
  prefix: 'likely__'
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__service__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__facebook__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__linkedin__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__odnoklassniki__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pinterest__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__telegram__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__twitter__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__vkontakte__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__whatsapp__ = __webpack_require__(17);
/**
 * Social network services
 */



/* eslint-disable sort-imports */








/* eslint-enable sort-imports */

var services = {
    facebook: __WEBPACK_IMPORTED_MODULE_2__facebook__["a" /* default */],
    linkedin: __WEBPACK_IMPORTED_MODULE_3__linkedin__["a" /* default */],
    odnoklassniki: __WEBPACK_IMPORTED_MODULE_4__odnoklassniki__["a" /* default */],
    pinterest: __WEBPACK_IMPORTED_MODULE_5__pinterest__["a" /* default */],
    telegram: __WEBPACK_IMPORTED_MODULE_6__telegram__["a" /* default */],
    twitter: __WEBPACK_IMPORTED_MODULE_7__twitter__["a" /* default */],
    vkontakte: __WEBPACK_IMPORTED_MODULE_8__vkontakte__["a" /* default */],
    whatsapp: __WEBPACK_IMPORTED_MODULE_9__whatsapp__["a" /* default */]
};

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["each"])(services, function (service, key) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__service__["a" /* default */])(service);

    service.name = key;
});

/* harmony default export */ __webpack_exports__["a"] = (services);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// This module is an entry point for CommonJS modules.
// It’s written with CommonJS imports and exports to make possible doing `module.exports = likely`.
// This is required so that users work with `require('likely')`, not `require('likely').default`
var _require = __webpack_require__(0),
    bools = _require.bools,
    getDefaultUrl = _require.getDefaultUrl,
    merge = _require.merge;

var Likely = __webpack_require__(18).default;
var config = __webpack_require__(2).default;

var _require2 = __webpack_require__(1),
    findAll = _require2.findAll;

var history = __webpack_require__(8).default;
__webpack_require__(19);

/**
 * @param {Node} node
 * @param {Object} options
 * @private
 * @returns {Likely}
 */
var initWidget = function initWidget(node, options) {
    var fullOptions = options || {};
    var defaults = {
        counters: true,
        timeout: 1e3,
        zeroes: false,
        title: document.title,
        wait: 0.5e3,
        url: getDefaultUrl()
    };
    var widget = node[config.name];

    var realOptions = merge({}, defaults, fullOptions, bools(node));
    if (widget) {
        widget.update(realOptions);
    } else {
        node[config.name] = new Likely(node, realOptions);
    }

    return widget;
};

/**
 * @deprecated
 * @returns {Likely}
 */

var likely = function () {
    function likely() {
        _classCallCheck(this, likely);

        // eslint-disable-next-line no-console
        console.warn('likely function is DEPRECATED and will be removed in 3.0. Use likely.initiate instead.');
        return likely.initiate.apply(likely, arguments);
    }

    _createClass(likely, null, [{
        key: 'initate',
        value: function initate() {
            // eslint-disable-next-line no-console
            console.warn('likely.initate function is DEPRECATED and will be removed in 3.0. Use likely.initiate instead.');
            return likely.initiate.apply(likely, arguments);
        }

        /**
         * Initiate Likely buttons on load
         * @param {Node|Array<Node>|Object} [nodes] a particular node or an array of widgets,
         *                                     if not specified,
         *                                     tries to init all the widgets
         * @param {Object} [options] additional options for each widget
         */

    }, {
        key: 'initiate',
        value: function initiate(nodes, options) {
            var realNodes = void 0;
            var realOptions = void 0;

            if (Array.isArray(nodes)) {
                // An array of nodes was passed
                realNodes = nodes;
                realOptions = options;
            } else if (nodes instanceof Node) {
                // A single node was passed
                realNodes = [nodes];
                realOptions = options;
            } else {
                // Options were passed, or the function was called without arguments
                realNodes = findAll('.' + config.name);
                realOptions = nodes;
            }

            initWidgets();
            history.onUrlChange(initWidgets);

            function initWidgets() {
                realNodes.forEach(function (node) {
                    initWidget(node, realOptions);
                });
            }
        }
    }]);

    return likely;
}();

module.exports = likely;

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__fetch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services__ = __webpack_require__(3);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }








var htmlSpan = '<span class="{className}">{content}</span>';

/**
 * Separate social link widget
 *
 * @param {Node} widget
 * @param {Likely} likely
 * @param {Object} options
 */

var LikelyButton = function () {
    function LikelyButton(widget, likely, options) {
        _classCallCheck(this, LikelyButton);

        this.widget = widget;
        this.likely = likely;
        this.options = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["merge"])(options);

        this.init();
    }

    /**
     * Initiate the button
     */


    _createClass(LikelyButton, [{
        key: 'init',
        value: function init() {
            this.detectService();
            this.detectParams();

            if (this.service) {
                this.initHtml();

                setTimeout(this.initCounter.bind(this), 0);
            }
        }

        /**
         * Update the counter
         *
         * @param {Object} options
         */

    }, {
        key: 'update',
        value: function update(options) {
            var className = '.' + __WEBPACK_IMPORTED_MODULE_2__config__["default"].prefix + 'counter';
            var counters = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__dom__["findAll"])(className, this.widget);

            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["extend"])(this.options, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["merge"])({ forceUpdate: false }, options));
            counters.forEach(function (node) {
                node.parentNode.removeChild(node);
            });

            this.initCounter();
        }

        /**
         * Get the config.name of service and its options
         */

    }, {
        key: 'detectService',
        value: function detectService() {
            var widget = this.widget;
            var service = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["getDataset"])(widget).service;

            if (!service) {
                service = Object.keys(__WEBPACK_IMPORTED_MODULE_4__services__["a" /* default */]).filter(function (service) {
                    return widget.classList.contains(service);
                })[0];
            }

            if (service) {
                this.service = service;

                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["extend"])(this.options, __WEBPACK_IMPORTED_MODULE_4__services__["a" /* default */][service]);
            }
        }

        /**
         * Merge params from data-* attributes into options hash map
         */

    }, {
        key: 'detectParams',
        value: function detectParams() {
            var options = this.options;
            var data = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["getDataset"])(this.widget);

            if (data.counter) {
                var counter = parseInt(data.counter, 10);

                if (isNaN(counter)) {
                    options.counterUrl = data.counter;
                } else {
                    options.counterNumber = counter;
                }
            }

            options.title = data.title || options.title;
            options.url = data.url || options.url;
        }

        /**
         * Inititate button's HTML
         */

    }, {
        key: 'initHtml',
        value: function initHtml() {
            var options = this.options;
            var widget = this.widget;
            var text = widget.innerHTML;

            widget.addEventListener('click', this.click.bind(this));
            widget.classList.remove(this.service);
            widget.className += ' ' + this.className('widget');

            var button = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["template"])(htmlSpan, {
                className: this.className('button'),
                content: text
            });

            var icon = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["template"])(htmlSpan, {
                className: this.className('icon'),
                content: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__dom__["wrapSVG"])(options.svgIconPath)
            });

            widget.innerHTML = icon + button;
        }

        /**
         * Fetch or get cached counter value and update the counter
         */

    }, {
        key: 'initCounter',
        value: function initCounter() {
            var options = this.options;

            if (options.counters && options.counterNumber) {
                this.updateCounter(options.counterNumber);
            } else if (options.counterUrl) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__fetch__["a" /* default */])(this.service, options.url, options)(this.updateCounter.bind(this));
            }
        }

        /**
         * @param {String} className
         * @returns {String}
         */

    }, {
        key: 'className',
        value: function className(_className) {
            var fullClass = __WEBPACK_IMPORTED_MODULE_2__config__["default"].prefix + _className;

            return fullClass + ' ' + fullClass + '_' + this.service;
        }

        /**
         * Update counter
         *
         * @param {String} counterString
         */

    }, {
        key: 'updateCounter',
        value: function updateCounter(counterString) {
            var counter = parseInt(counterString, 10) || 0;

            var counterElement = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__dom__["find"])('.' + __WEBPACK_IMPORTED_MODULE_2__config__["default"].name + '__counter', this.widget);

            if (counterElement) {
                counterElement.parentNode.removeChild(counterElement);
            }

            var options = {
                className: this.className('counter'),
                content: counter
            };

            if (!counter && !this.options.zeroes) {
                options.className += ' ' + __WEBPACK_IMPORTED_MODULE_2__config__["default"].prefix + 'counter_empty';
                options.content = '';
            }

            this.widget.appendChild(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__dom__["createNode"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["template"])(htmlSpan, options)));

            this.likely.updateCounter(this.service, counter);
        }

        /**
         * Click event listener
         * @returns {Boolean}
         */

    }, {
        key: 'click',
        value: function click() {
            var options = this.options;

            if (options.click.call(this)) {
                var url = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["makeUrl"])(options.popupUrl, {
                    url: options.url,
                    title: options.title
                });

                if (options.openPopup === false) {
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__dom__["createTempLink"])(this.addAdditionalParamsToUrl(url));
                    return false;
                }

                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__dom__["openPopup"])(this.addAdditionalParamsToUrl(url), __WEBPACK_IMPORTED_MODULE_2__config__["default"].prefix + this.service, options.popupWidth, options.popupHeight);
            }

            return false;
        }

        /**
         * Append service data to URL
         *
         * @param {String} url
         * @returns {String}
         */

    }, {
        key: 'addAdditionalParamsToUrl',
        value: function addAdditionalParamsToUrl(url) {
            var parameters = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["query"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["merge"])(this.widget.dataset, this.options.data));
            var delimeter = url.indexOf('?') === -1 ? '?' : '&';

            return parameters === '' ? url : url + delimeter + parameters;
        }
    }]);

    return LikelyButton;
}();

/* harmony default export */ __webpack_exports__["a"] = (LikelyButton);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint-disable consistent-return, no-param-reassign */

/**
 * Factory function
 *
 * This function returns function with following API:
 *
 * - if passed argument is callback, then this callback would be called
 *   if the value was changed
 * - if passed argument is anything but undefined or function, then this
 *   function behaves like setter
 * - if argument isn't provided, then return value stored in closure
 *
 * @param {Object} value
 * @returns {Function}
 */
/* harmony default export */ __webpack_exports__["a"] = (function (value) {
    var listeners = [];

    return function (argument) {
        var type = typeof argument === 'undefined' ? 'undefined' : _typeof(argument);

        if (type === 'undefined') {
            return value;
        } else if (type === 'function') {
            listeners.push(argument);
        } else {
            value = argument;

            listeners.forEach(function (listener) {
                listener(argument);
            });
        }
    };
});

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__factory__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services__ = __webpack_require__(3);




var factories = {};

/**
 * Fetch data
 *
 * @param {String} service
 * @param {String} url
 * @param {Object} options
 * @returns {Promise}
 */
/* harmony default export */ __webpack_exports__["a"] = (function (service, url, options) {
    if (!factories[service]) {
        factories[service] = {};
    }

    var counters = factories[service];
    var counter = counters[url];

    if (!options.forceUpdate && counter) {
        return counter;
    }

    counter = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__factory__["a" /* default */])();

    var href = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["makeUrl"])(options.counterUrl, {
        url: url
    });

    __WEBPACK_IMPORTED_MODULE_2__services__["a" /* default */][service].counter(href, counter, url);

    counters[url] = counter;
    return counter;
});

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var callbacks = [];
var handleUrlChange = function handleUrlChange() {
    callbacks.forEach(function (callback) {
        callback();
    });
};

var setupHistoryWatcher = function setupHistoryWatcher() {
    var pushState = window.history.pushState;
    window.history.pushState = function () {
        // browser should change the url first
        setTimeout(handleUrlChange, 0);
        return pushState.apply(window.history, arguments);
    };

    var replaceState = window.history.replaceState;
    window.history.replaceState = function () {
        // browser should change the url first
        setTimeout(handleUrlChange, 0);
        return replaceState.apply(window.history, arguments);
    };

    window.addEventListener('popstate', handleUrlChange);
};

var isWatchingHistory = false;

var history = {
    onUrlChange: function onUrlChange(callback) {
        if (!isWatchingHistory) {
            setupHistoryWatcher();
            isWatchingHistory = true;
        }

        callbacks.push(callback);
    }
};

/* harmony default export */ __webpack_exports__["default"] = (history);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dom__ = __webpack_require__(1);


/**
 * @param {String} url
 * @param {Function} factory
 */
var counter = function counter(url, factory) {
    var _this = this;

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__dom__["getJSON"])(url, function (count) {
        try {
            var convertedNumber = typeof _this.convertNumber === 'function' ? _this.convertNumber(count) : count;
            factory(convertedNumber);
        } catch (e) {}
    });
};

/**
 * @param {Object} options
 */
/* harmony default export */ __webpack_exports__["a"] = (function (options) {
    // __likelyCounterMock is used for UI testing and is set on window
    // because this function is executed right when Likely is loaded.
    // There’s currently no way to do `likely.__counterMock = ...`
    // before running this method.
    options.counter = __WEBPACK_IMPORTED_MODULE_0__dom__["global"].__likelyCounterMock || options.counter || counter;
    options.click = options.click || function () {
        return true;
    };
});

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Facebook service provider
 */

/* harmony default export */ __webpack_exports__["a"] = ({
    counterUrl: 'https://graph.facebook.com/?id={url}&fields=og_object%7Bengagement%7Bcount%7D%7D&callback=?',
    convertNumber: function convertNumber(data) {
        return data.og_object.engagement.count;
    },
    popupUrl: 'https://www.facebook.com/sharer/sharer.php?u={url}',
    popupWidth: 600,
    popupHeight: 500,
    svgIconPath: '15.117 0H.883C.395 0 0 .395 0 .883v14.234c0 .488.395.883.883.883h7.663V9.804H6.46V7.39h2.086V5.607c0-2.066 1.262-3.19 3.106-3.19.883 0 1.642.064 1.863.094v2.16h-1.28c-1 0-1.195.48-1.195 1.18v1.54h2.39l-.31 2.42h-2.08V16h4.077c.488 0 .883-.395.883-.883V.883C16 .395 15.605 0 15.117 0'
});

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * LinkedIn service provider
 */

/* harmony default export */ __webpack_exports__["a"] = ({
    popupUrl: 'https://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}',
    popupWidth: 600,
    popupHeight: 500,
    svgIconPath: '2.4,6h2.4v7.6H2.4V6z M3.6,2.2c0.8,0,1.4,0.6,1.4,1.4C4.9,4.3,4.3,5,3.6,5C2.8,5,2.2,4.3,2.2,3.6C2.2,2.8,2.8,2.2,3.6,2.2C3.6,2.2,3.6,2.2,3.6,2.2 M6.2,6h2.3v1h0C9,6.2,9.9,5.8,10.8,5.8c2.4,0,2.8,1.6,2.8,3.6v4.2h-2.4V9.9c0-0.9,0-2-1.2-2c-1.2,0-1.4,1-1.4,2v3.8H6.2V6z M13,0H3C1,0,0,1,0,3v10c0,2,1,3,3,3h10c2,0,3-1,3-3V3C16,1,15,0,13,0z'
});

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
/**
 * Odnoklassniki service provider
 */




var odnoklassniki = {
    counterUrl: 'https://connect.ok.ru/dk?st.cmd=extLike&ref={url}&uid={index}',
    counter: function counter(url, promise) {
        this.promises.push(promise);

        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__dom__["getScript"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["makeUrl"])(url, {
            index: this.promises.length - 1
        }));
    },

    promises: [],
    popupUrl: 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki&st.shareUrl={url}',
    popupWidth: 640,
    popupHeight: 400,
    svgIconPath: '8 6.107c.888 0 1.607-.72 1.607-1.607 0-.888-.72-1.607-1.607-1.607s-1.607.72-1.607 1.607c0 .888.72 1.607 1.607 1.607zM13 0H3C1 0 0 1 0 3v10c0 2 1 3 3 3h10c2 0 3-1 3-3V3c0-2-1-3-3-3zM8 .75c2.07 0 3.75 1.68 3.75 3.75 0 2.07-1.68 3.75-3.75 3.75S4.25 6.57 4.25 4.5C4.25 2.43 5.93.75 8 .75zm3.826 12.634c.42.42.42 1.097 0 1.515-.21.208-.483.313-.758.313-.274 0-.548-.105-.758-.314L8 12.59 5.69 14.9c-.42.418-1.098.418-1.516 0s-.42-1.098 0-1.516L6.357 11.2c-1.303-.386-2.288-1.073-2.337-1.11-.473-.354-.57-1.025-.214-1.5.354-.47 1.022-.567 1.496-.216.03.022 1.4.946 2.698.946 1.31 0 2.682-.934 2.693-.943.474-.355 1.146-.258 1.5.213.355.474.26 1.146-.214 1.5-.05.036-1.035.723-2.338 1.11l2.184 2.184'
};

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["set"])(__WEBPACK_IMPORTED_MODULE_0__dom__["global"], 'ODKL.updateCount', function (index, counter) {
    odnoklassniki.promises[index](counter);
});

/* harmony default export */ __webpack_exports__["a"] = (odnoklassniki);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Pinterest service provider
 */

/* harmony default export */ __webpack_exports__["a"] = ({
    counterUrl: 'https://api.pinterest.com/v1/urls/count.json?url={url}&callback=?',
    convertNumber: function convertNumber(counter) {
        return counter.count;
    },
    popupUrl: 'https://pinterest.com/pin/create/button/?url={url}&description={title}',
    popupWidth: 630,
    popupHeight: 270,
    svgIconPath: '7.99 0c-4.417 0-8 3.582-8 8 0 3.39 2.11 6.284 5.086 7.45-.07-.633-.133-1.604.028-2.295.145-.624.938-3.977.938-3.977s-.24-.48-.24-1.188c0-1.112.645-1.943 1.448-1.943.683 0 1.012.512 1.012 1.127 0 .686-.437 1.713-.663 2.664-.19.796.398 1.446 1.184 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.255-3.343-3.255-2.276 0-3.612 1.707-3.612 3.472 0 .688.265 1.425.595 1.826.065.08.075.15.055.23-.06.252-.195.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.835-4.84 5.287-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.74 4.976-4.152 4.976-.81 0-1.573-.42-1.834-.92l-.498 1.903c-.18.695-.668 1.566-.994 2.097.75.232 1.544.357 2.37.357 4.417 0 8-3.582 8-8s-3.583-8-8-8'
});

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Telegram service provider
 */

/* harmony default export */ __webpack_exports__["a"] = ({
    popupUrl: 'https://telegram.me/share/url?url={url}',
    popupWidth: 600,
    popupHeight: 500,
    svgIconPath: '6,11.960784l-1,-3l11,-8l-15.378,5.914c0,0 -0.672,0.23 -0.619,0.655c0.053,0.425 0.602,0.619 0.602,0.619l3.575,1.203l1.62,5.154l2.742,-2.411l-0.007,-0.005l3.607,2.766c0.973,0.425 1.327,-0.46 1.327,-0.46l2.531,-13.435l-10,11z'
});

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Twitter service provider
 */

/* harmony default export */ __webpack_exports__["a"] = ({
    popupUrl: 'https://twitter.com/intent/tweet?url={url}&text={title}',
    popupWidth: 600,
    popupHeight: 450,
    click: function click() {
        if (!/[.?:\-–—]\s*$/.test(this.options.title)) {
            this.options.title += ':';
        }

        return true;
    },

    // Icon source: https://github.com/jekyll/minima/blob/affcd93be22e960afd2be08e6891d99b31bcf920/_includes/icon-twitter.svg
    svgIconPath: '15.969,3.058c-0.586,0.26-1.217,0.436-1.878,0.515c0.675-0.405,1.194-1.045,1.438-1.809c-0.632,0.375-1.332,0.647-2.076,0.793c-0.596-0.636-1.446-1.033-2.387-1.033c-1.806,0-3.27,1.464-3.27,3.27 c0,0.256,0.029,0.506,0.085,0.745C5.163,5.404,2.753,4.102,1.14,2.124C0.859,2.607,0.698,3.168,0.698,3.767 c0,1.134,0.577,2.135,1.455,2.722C1.616,6.472,1.112,6.325,0.671,6.08c0,0.014,0,0.027,0,0.041c0,1.584,1.127,2.906,2.623,3.206 C3.02,9.402,2.731,9.442,2.433,9.442c-0.211,0-0.416-0.021-0.615-0.059c0.416,1.299,1.624,2.245,3.055,2.271 c-1.119,0.877-2.529,1.4-4.061,1.4c-0.264,0-0.524-0.015-0.78-0.046c1.447,0.928,3.166,1.469,5.013,1.469 c6.015,0,9.304-4.983,9.304-9.304c0-0.142-0.003-0.283-0.009-0.423C14.976,4.29,15.531,3.714,15.969,3.058'
});

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
/**
 * Vkontakte service provider
 */




var vkontakte = {
    counterUrl: 'https://vk.com/share.php?act=count&url={url}&index={index}',
    counter: function counter(url, promise) {
        this.promises.push(promise);

        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__dom__["getScript"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["makeUrl"])(url, {
            index: this.promises.length - 1
        }));
    },

    promises: [],
    popupUrl: 'https://vk.com/share.php?url={url}&title={title}',
    popupWidth: 550,
    popupHeight: 330,
    svgIconPath: '7.828 12.526h.957s.288-.032.436-.19c.14-.147.14-.42.14-.42s-.02-1.284.58-1.473c.59-.187 1.34 1.24 2.14 1.788.61.42 1.07.33 1.07.33l2.14-.03s1.12-.07.59-.95c-.04-.07-.3-.65-1.58-1.84-1.34-1.24-1.16-1.04.45-3.19.98-1.31 1.38-2.11 1.25-2.45-.11-.32-.84-.24-.84-.24l-2.4.02s-.18-.02-.31.06-.21.26-.21.26-.38 1.02-.89 1.88C10.27 7.9 9.84 8 9.67 7.88c-.403-.26-.3-1.053-.3-1.62 0-1.76.27-2.5-.52-2.69-.26-.06-.454-.1-1.123-.11-.86-.01-1.585.006-1.996.207-.27.135-.48.434-.36.45.16.02.52.098.71.358.25.337.24 1.09.24 1.09s.14 2.077-.33 2.335c-.33.174-.77-.187-1.73-1.837-.49-.84-.86-1.78-.86-1.78s-.07-.17-.2-.27c-.15-.11-.37-.15-.37-.15l-2.29.02s-.34.01-.46.16c-.11.13-.01.41-.01.41s1.79 4.19 3.82 6.3c1.86 1.935 3.97 1.81 3.97 1.81'
};

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["set"])(__WEBPACK_IMPORTED_MODULE_0__dom__["global"], 'VK.Share.count', function (index, count) {
    vkontakte.promises[index](count);
});

/* harmony default export */ __webpack_exports__["a"] = (vkontakte);

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * WhatsApp service provider
 */

/* harmony default export */ __webpack_exports__["a"] = ({
    // %0D%0A% is the encoding for enter key
    popupUrl: 'whatsapp://send?text={title}%0D%0A%0D%0A{url}',

    // Sending on WhatsApp using manifest link instead of popup
    openPopup: false,

    svgIconPath: '8.0292969 0 C 3.6412969 0 0.06940625 3.5557344 0.06640625 7.9277344 C 0.06640625 9.3247344 0.43385936 10.688578 1.1308594 11.892578 L 0 16 L 4.2226562 14.898438 C 5.3866562 15.528438 6.6962969 15.862281 8.0292969 15.863281 L 8.0332031 15.863281 C 12.423199 15.863281 15.998 12.306594 16 7.9335938 C 16 5.8165938 15.172922 3.8222186 13.669922 2.3242188 L 13.679688 2.3007812 C 12.159653 0.8307817 10.159297 -2.9605947e-016 8.0292969 0 z M 4.4589844 3.2382812 C 4.6263665 3.2382813 4.7936277 3.2373139 4.9394531 3.25 C 5.095423 3.25 5.306878 3.189055 5.5097656 3.6835938 C 5.7202615 4.1781321 6.2237071 5.418117 6.2871094 5.5449219 C 6.3505124 5.6717267 6.3922846 5.8107546 6.3085938 5.9882812 C 6.2223663 6.1531272 6.1809093 6.2560375 6.0566406 6.4082031 C 5.9298358 6.560369 5.7918587 6.7393913 5.6777344 6.8535156 C 5.5509298 6.9803204 5.4193132 7.1174841 5.5664062 7.3710938 C 5.7147679 7.6247032 6.220019 8.4490288 6.9707031 9.1210938 C 7.9344191 9.9833661 8.7483437 10.250149 9.0019531 10.376953 C 9.2530266 10.491078 9.3997816 10.477349 9.546875 10.3125 C 9.6939686 10.145117 10.178322 9.5818366 10.345703 9.3320312 C 10.514354 9.0784218 10.683278 9.1181658 10.914062 9.203125 C 11.146116 9.286816 12.383111 9.8946797 12.636719 10.021484 L 12.646484 9.9589844 C 12.900093 10.073108 13.06355 10.137829 13.126953 10.251953 C 13.190353 10.366078 13.192128 10.859096 12.976562 11.455078 C 12.766067 12.05106 11.759099 12.584074 11.273438 12.660156 C 10.838496 12.723556 10.287183 12.74881 9.6835938 12.558594 C 9.3158512 12.431788 8.8457781 12.280954 8.2421875 12.027344 C 5.7111649 10.936823 4.0584453 8.3992212 3.9316406 8.234375 C 3.8061039 8.0568483 2.9023438 6.8647716 2.9023438 5.6347656 C 2.9023438 4.4047596 3.5524185 3.7946251 3.7832031 3.5410156 C 4.0139878 3.3000865 4.2890659 3.2382812 4.4589844 3.2382812'
});

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__button__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }






/**
 * Main widget view
 *
 * @param {Node} container
 * @param {Object} options
 */

var Likely = function () {
    function Likely(container, options) {
        _classCallCheck(this, Likely);

        this.container = container;
        this.options = options;

        this.countersLeft = 0;
        this.buttons = [];
        this.number = 0;

        this.init();
    }

    /**
     * Initiate the social buttons widget
     */


    _createClass(Likely, [{
        key: 'init',
        value: function init() {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils__["toArray"])(this.container.children).forEach(this.addButton.bind(this));

            if (this.options.counters) {
                this.timer = setTimeout(this.appear.bind(this), this.options.wait);
                this.timeout = setTimeout(this.ready.bind(this), this.options.timeout);
            } else {
                this.appear();
            }
        }

        /**
         * Add a button
         *
         * @param {Node} node
         */

    }, {
        key: 'addButton',
        value: function addButton(node) {
            var button = new __WEBPACK_IMPORTED_MODULE_0__button__["a" /* default */](node, this, this.options);

            this.buttons.push(button);

            if (button.options.counterUrl) {
                this.countersLeft++;
            }
        }

        /**
         * Update the timer with URL
         *
         * @param {Object} options
         */

    }, {
        key: 'update',
        value: function update(options) {
            if (options.forceUpdate || options.url && options.url !== this.options.url) {
                this.countersLeft = this.buttons.length;
                this.number = 0;

                this.buttons.forEach(function (button) {
                    button.update(options);
                });
            }
        }

        /**
         * Update counter
         *
         * @param {String} service
         * @param {Number} counter
         */

    }, {
        key: 'updateCounter',
        value: function updateCounter(service, counter) {
            if (counter) {
                this.number += counter;
            }

            this.countersLeft--;

            if (this.countersLeft === 0) {
                this.appear();
                this.ready();
            }
        }

        /**
         * Show the buttons with smooth animation
         */

    }, {
        key: 'appear',
        value: function appear() {
            this.container.classList.add(__WEBPACK_IMPORTED_MODULE_1__config__["default"].name + '_visible');
        }

        /**
         * Get. Set. Ready.
         */

    }, {
        key: 'ready',
        value: function ready() {
            if (this.timeout) {
                clearTimeout(this.timeout);

                this.container.classList.add(__WEBPACK_IMPORTED_MODULE_1__config__["default"].name + '_ready');
            }
        }
    }]);

    return Likely;
}();

/* harmony default export */ __webpack_exports__["default"] = (Likely);

/***/ }),
/* 19 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// This module is an entry point when `likely.js` is just dropped into the browser.
// It’s written with CommonJS imports and exports to make possible doing `module.exports = likely`.
// This is required so that users work with `window.likely`, not `window.likely.default`

var likely = __webpack_require__(4);

window.addEventListener('load', function () {
    likely.initiate();
});

module.exports = likely;

/***/ })
/******/ ]);
});