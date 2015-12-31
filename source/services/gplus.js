/**
 * Google+ service provider
 */

var config = require('../config'),
    utils  = require('../utils'),
    dom    = require('../dom');

var gplus = {
    counterUrl: 'https://share.yandex.net/counter/gpp/?url={url}&callback=?',
    gid: 0,
    promises: {},
    popupUrl: 'https://plus.google.com/share?url={url}',
    popupWidth: 700,
    popupHeight: 500
};

module.exports = gplus;