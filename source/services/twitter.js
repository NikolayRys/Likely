'use strict';

/**
 * Twitter service provider
 */

module.exports = {
    counterUrl: 'http://public.newsharecounts.com/count.json?url={url}&callback=?',		
    convertNumber: function (counter) {		
        return counter.count;		
    },
    popupUrl: 'https://twitter.com/intent/tweet?url={url}&text={title}',
    popupWidth: 600,
    popupHeight: 450,
    click: function () {
        if (!/[\.\?:\-–—]\s*$/.test(this.options.title)) {
            this.options.title += ':';
        }

        return true;
    },
};
