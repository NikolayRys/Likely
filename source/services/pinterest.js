'use strict';

/**
 * Pinterest service provider
 */

module.exports = {
    counterUrl: 'https://api.pinterest.com/v1/urls/count.json?url={url}&callback=?',
    convertNumber: function (counter) {
        return counter.count;
    },
    popupUrl: 'https://pinterest.com/pin/create/button/?url={url}&description={title}',
    popupWidth: 630,
    popupHeight: 270,
};
