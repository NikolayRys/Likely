/**
 * Pinterest service provider
 */

var config = require('../config');

module.exports = {
    counterUrl: config.protocol 
        + "//api.pinterest.com/v1/urls/count.json?url={url}&callback=?",
    convertNumber: function (counter) {
        return counter.count;
    },
    popupUrl: config.protocol 
        + "//pinterest.com/pin/create/button/?url={url}&description={title}",
    popupWidth: 630,
    popupHeight: 270
};