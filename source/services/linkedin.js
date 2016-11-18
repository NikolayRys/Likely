'use strict';

/**
 * LinkedIn service provider
 */

module.exports = {
    counterUrl: 'https://www.linkedin.com/countserv/count/share?url={url}&format=jsonp&callback=?',
    convertNumber: function (data) {
        return data.count;
    },
    popupUrl: 'https://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}',
    popupWidth: 600,
    popupHeight: 500,
};
