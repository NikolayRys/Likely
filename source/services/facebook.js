/**
 * Facebook service provider 
 */

module.exports = {
    counterUrl: "https://graph.facebook.com/fql?q=SELECT+total_count+FROM+link_stat+WHERE+url%3D%22{url}%22&callback=?",
    convertNumber: function (counter) {
        return counter.data[0].total_count;
    },
    popupUrl: "https://www.facebook.com/sharer/sharer.php?u={url}",
    popupWidth: 600,
    popupHeight: 500
};
