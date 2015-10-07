/**
 * Google+ service provider
 */

var config = require('../config'),
    utils  = require('../utils'),
    dom    = require('../dom');

var gplus = {
    counterUrl: config.secure 
        ? undefined 
        : "http://share.yandex.ru/gpp.xml?gid={gid}&url={url}",
    counter: function (url, promise, id) {
        var gid = this.gid++;
        
        this.promises[gid + '_' + id] = promise;
        
        dom.getScript(utils.makeUrl(url, {
            gid: gid
        }));
    },
    gid: 0,
    promises: {},
    popupUrl: "https://plus.google.com/share?url={url}",
    popupWidth: 700,
    popupHeight: 500
};

/**
 * Global Google+ service callback
 * 
 * Google+ API for page counters that is provided by yandex
 * has few limitations: 
 * 
 * 1. it can be used only once on the page
 * 2. if the amount of +'s are more than 10k, they're rounded to 10k
 * 
 * First limitation is solved by following hack:
 * get URL of requested page by throwing the error and gettin google+ API
 * URL, parsing the URL for which we requested counter, and then 
 * finding the correct URL in gplus._ object and resolve it
 * 
 * @param {Number} counter
 */
utils.set(window, 'services.gplus.cb', function (counter) {
    if (typeof counter === "string") {
        counter = counter.replace(/\D/g, "");
    }
    
    var url = utils.getStackURL(),
        id  = utils.getURL(url),
        gid = url.match(/gid=(\d+)/).pop();
    
    gplus.promises[gid + '_' + id](counter);
});

module.exports = gplus;