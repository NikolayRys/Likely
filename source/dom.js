var div = document.createElement('div'),
    gid = 0;

var dom = module.exports = {
    /**
     * Wrap SVG coords from data object into SVG tag
     * 
     * @param {String} coords
     */
    wrapSVG: function (coords) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" ' 
            + 'viewBox="0 0 16 16"><path d="M' 
            + coords 
            + 'z"/></svg>';
    },

    /**
     * Create node from HTML
     * 
     * @param {String} html
     */
    createNode: function (html) {
        div.innerHTML = html;
    
        return div.children[0];
    },

    /**
     * Load script
     * 
     * @param {String} url
     */
    getScript: function (url) {
        var script = document.createElement('script'),
            head   = document.head;
    
        script.type = 'text/javascript';
        script.src = url;
        
        head.appendChild(script);
        head.removeChild(script);
    },

    /**
     * Get JSON
     * 
     * @param {String} url
     * @param {Function} callback
     */
    getJSON: function (url, callback) {
        var name = encodeURIComponent('random_fun_' + (++gid));
    
        url = url.replace(
            /callback=(\?)/, 
            'callback=' + name
        );
    
        window[name] = callback;
    
        dom.getScript(url);
    },

    /**
     * Find first node by selector
     * 
     * @param {String} selector
     * @param {Node} node
     * @return {Node}
     */
    find: function (selector, node) {
        node = node || document;
    
        return node.querySelector(selector);
    },

    /**
     * Find all nodes by selector
     * 
     * @param {String} selector
     * @param {Node} node
     * @return {NodeList}
     */
    findAll: function (selector, node) {
        node = node || document;
    
        return node.querySelectorAll(selector);
    },
    
    /**
     * Open the popup
     * 
     * @param {String} url
     * @param {String} winId
     * @param {Number} width,
     * @param {Number} height
     */
    openPopup: function (url, winId, width, height) {
        var left = Math.round(screen.width / 2 - width / 2),
            top  = 0;
        
        if (screen.height > height) {
            top = Math.round(screen.height / 3 - height / 2);
        }
        
        var options = 'left='    + left 
                    + ',top='    + top 
                    + ',width='  + width 
                    + ',height=' + height 
                    + ',personalbar=0,toolbar=0,scrollbars=1,resizable=1'
        
        var win = window.open(url, winId, options);
        
        if (!win) {
            return location.href = url;
        }
        
        win.focus();
        
        return win;
    }
};