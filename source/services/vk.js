/**
 * Vkontakte service provider
 */

var config = require('../config'),
    utils  = require('../utils'),
    dom    = require('../dom');

var vkontakte = {
    counterUrl: "https://vk.com/share.php?act=count&url={url}&index={index}",
    counter: function (url, promise) {
        this.promises.push(promise);
        
        dom.getScript(utils.makeUrl(url, {
            index: this.promises.length - 1
        }));
    },
    promises: [],
    popupUrl: config.protocol + "//vk.com/share.php?url={url}&title={title}",
    popupWidth: 550,
    popupHeight: 330
};

utils.set(window, 'VK.Share.count', function (index, count) {
    vkontakte.promises[index](count);
});

module.exports = vkontakte;
