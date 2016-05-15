'use strict';

/**
 * Odnoklassniki service provider
 */

var utils = require('../utils');
var dom = require('../dom');

var odnoklassniki = {
    counterUrl: 'https://connect.ok.ru/dk?st.cmd=extLike&ref={url}&uid={index}',
    counter: function (url, promise) {
        this.promises.push(promise);

        dom.getScript(utils.makeUrl(url, {
            index: this.promises.length - 1,
        }));
    },
    promises: [],
    popupUrl: 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki&st.shareUrl={url}',
    popupWidth: 640,
    popupHeight: 400,
};

utils.set(window, 'ODKL.updateCount', function (index, counter) {
    odnoklassniki.promises[index](counter);
});

module.exports = odnoklassniki;
