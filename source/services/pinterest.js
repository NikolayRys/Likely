/**
 * Pinterest service provider
 */

export default {
    counterUrl: 'https://api.pinterest.com/v1/urls/count.json?url={url}&callback=?',
    convertNumber: (counter) => counter.count,
    popupUrl: 'https://pinterest.com/pin/create/button/?url={url}&description={title}',
    popupWidth: 630,
    popupHeight: 270,
};
