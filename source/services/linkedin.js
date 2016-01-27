/**
 * LinkedIn service provider
 */

module.exports = {
    counterUrl: 'http://www.linkedin.com/countserv/count/share?url={url}&format=jsonp&callback=?',
    convertNumber: function (counter) {
        return counter.count;
    },
    popupUrl: 'https://www.linkedin.com/shareArticle?url={url}&mini=true&title={title}',
    popupWidth: 600,
    popupHeight: 500
};