var div = document.createElement('div'),
    gid = 0,
    dom = {};

/**
 * Wrap SVG coords from data object into SVG tag
 * 
 * @param {String} coords
 */
dom.wrapSVG = function (coords) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" ' 
        + 'viewBox="0 0 16 16"><path d="M' 
        + coords 
        + 'z"/></svg>';
}

/**
 * Create node from HTML
 * 
 * @param {String} html
 */
dom.createNode = function (html) {
    div.innerHTML = html;
    
    return div.children[0];
}

/**
 * Load script
 * 
 * @param {String} url
 */
dom.getScript = function (url) {
    var script = document.createElement('script');
    
    script.type = 'text/javascript';
    script.src = url;
    
    document.head.appendChild(script);
    document.head.removeChild(script);
}

/**
 * Get JSON
 * 
 * @param {String} url
 * @param {Function} callback
 */
dom.getJSON = function (url, callback) {
    var name = 'random_fun_' + Date.now() + '_' + (++gid);
    
    url = url.replace(/callback=(\?)/, 'callback=' + encodeURIComponent(name));
    
    window[name] = callback;
    
    dom.getScript(url);
}

/**
 * Find first node by selector
 * 
 * @param {String} selector
 * @param {Node} node
 * @return {Node}
 */
dom.find = function (selector, node) {
    node = node || document;
    
    return node.querySelector(selector);
}

/**
 * Find all nodes by selector
 * 
 * @param {String} selector
 * @param {Node} node
 * @return {NodeList}
 */
dom.findAll = function (selector, node) {
    node = node || document;
    
    return node.querySelectorAll(selector);
}

module.exports = dom;