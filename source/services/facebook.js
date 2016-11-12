/**
 * Facebook service provider
 */

export default {
    counterUrl: 'https://graph.facebook.com/?id={url}&callback=?',
    convertNumber: (data) => data.share.share_count,
    popupUrl: 'https://www.facebook.com/sharer/sharer.php?u={url}',
    popupWidth: 600,
    popupHeight: 500,
};
