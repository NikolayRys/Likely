var config = require('./config'),
    utils  = require('./utils'),
    dom    = require('./dom');

var gpCallback = function (counter) {
    if (typeof counter === "string") {
        counter = counter.replace(/\D/g, "");
    }
    
    var url = utils.getStackURL(),
        id  = utils.getURL(url),
        gid = url.match(/gid=(\d+)/).pop();
    
    services.gplus._[gid + '_' + id].resolve(parseInt(counter, 10));
};

var services = {
    /**
     * Facebook service
     */
    facebook: {
        counterUrl: "https://graph.facebook.com/fql?q=SELECT+total_count+FROM+link_stat+WHERE+url%3D%22{url}%22&callback=?",
        convertNumber: function (counter) {
            return counter.data[0].total_count;
        },
        popupUrl: "https://www.facebook.com/sharer/sharer.php?u={url}",
        popupWidth: 600,
        popupHeight: 500
    },
    
    /**
     * Twitter service
     */
    twitter: {
        counterUrl: "https://cdn.api.twitter.com/1/urls/count.json?url={url}&callback=?",
        convertNumber: function (counter) {
            return counter.count;
        },
        popupUrl: "https://twitter.com/intent/tweet?url={url}&text={title}",
        popupWidth: 600,
        popupHeight: 450,
        click: function () {
            if (!/[\.\?:\-–—]\s*$/.test(this.options.title)) {
                this.options.title += ':';
            }
            
            return true;
        }
    },
    
    /**
     * VK.com service
     */
    vkontakte: {
        counterUrl: "https://vk.com/share.php?act=count&url={url}&index={index}",
        counter: function (url, promise) {
            var vk = services.vkontakte;
            
            if (vk._ == undefined) {
                vk._ = [];
                
                window.VK = window.VK || {};
                window.VK.Share = {};
                window.VK.Share.count = function (index, count) {
                    vk._[index].resolve(count);
                };
            }
            
            vk._.push(promise);
            
            dom.getScript(utils.makeUrl(url, {index: vk._.length - 1}));
        },
        popupUrl: config.protocol + "//vk.com/share.php?url={url}&title={title}",
        popupWidth: 550,
        popupHeight: 330
    },
    
    /**
     * Google+ service
     */
    gplus: {
        gid: 0,
        counterUrl: config.secure 
            ? undefined 
            : "http://share.yandex.ru/gpp.xml?gid={gid}&url={url}",
        counter: function (url, promise, id) {
            var gp  = services.gplus,
                gid = (++gp.gid);
                
            if (gp._ == undefined) {
                gp._ = {};
                
                if (!window.services) {
                    window.services = {};
                }
                
                window.services.gplus = {};
                window.services.gplus.cb = gpCallback;
            }
            
            gp._[gid + '_' + id] = promise;
            
            dom.getScript(utils.makeUrl(url, {
                gid: gid
            }));
        },
        popupUrl: "https://plus.google.com/share?url={url}",
        popupWidth: 700,
        popupHeight: 500
    },
    
    /**
     * Pinterest service
     */
    pinterest: {
        counterUrl: config.protocol 
            + "//api.pinterest.com/v1/urls/count.json?url={url}&callback=?",
        convertNumber: function (counter) {
            return counter.count;
        },
        popupUrl: config.protocol 
            + "//pinterest.com/pin/create/button/?url={url}&description={title}",
        popupWidth: 630,
        popupHeight: 270
    },
    
    /**
     * Odnoklassniki service
     */
    odnoklassniki: {
        counterUrl: config.secure 
            ? undefined 
            : "http://connect.ok.ru/dk?st.cmd=extLike&ref={url}&uid={index}",
        counter: function (url, promise) {
            var dk = services.odnoklassniki;
            
            if (dk._ == undefined) {
                dk._ = [];
                 
                window.ODKL = window.ODKL || {};
                window.ODKL.updateCount = function (index, counter) {
                    dk._[index].resolve(counter);
                };
            }
            
            dk._.push(promise);
            
            dom.getScript(utils.makeUrl(url, {index: dk._.length - 1}));
        },
        popupUrl: "http://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki"
                + "&st.shareUrl={url}",
        popupWidth: 640,
        popupHeight: 400
    }
};

var svg = require('./svg');

for (var key in services) {
    services[key].svgi = svg[key];
}

module.exports = services;