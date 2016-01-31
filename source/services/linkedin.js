/**
 * LinkedIn service provider
 */

var config = require('../config');

module.exports = {
    counterUrl: config.protocol + '//www.linkedin.com/countserv/count/share?url={url}&format=jsonp&callback=?',
    convertNumber: function (counter) {
        return counter.count;
    },
    popupUrl: config.protocol + '://www.linkedin.com/shareArticle?url={url}&mini=true&title={title}',
    popupWidth: 600,
    popupHeight: 500
};
