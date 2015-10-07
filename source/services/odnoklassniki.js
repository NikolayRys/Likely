/**
 * Odnoklassniki service provider
 */

var config = require('../config'),
    utils  = require('../utils'),
    dom    = require('../dom');

var odnoklassniki = {
    counterUrl: config.secure 
        ? undefined 
        : "http://connect.ok.ru/dk?st.cmd=extLike&ref={url}&uid={index}",
    counter: function (url, promise) {
        var dk = odnoklassniki;
        
        dk._.push(promise);
        
        dom.getScript(utils.makeUrl(url, {index: dk._.length - 1}));
    },
    _: [],
    popupUrl: "http://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki"
            + "&st.shareUrl={url}",
    popupWidth: 640,
    popupHeight: 400
};

utils.set(window, 'ODKL.updateCount', function (index, counter) {
    odnoklassniki._[index](counter);
});

module.exports = odnoklassniki;