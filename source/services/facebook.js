/**
 * Facebook service provider
 * Share doc: https://developers.facebook.com/docs/workplace/sharing/share-dialog/
 * Counter doc: https://developers.facebook.com/docs/graph-api/reference/v8.0/engagement
 *
 * For hackers: the access token below is public, heavily restricted and doesn't allow to access anything of value
 */

export default {
    name: 'facebook',
    counterUrl: 'https://graph.facebook.com/?id={url}&access_token=1729830587180291|102e6d79cda2fa63b65c99c039eed12a&fields=og_object%7Bengagement%7Bcount%7D%7D',
    convertNumber: (data) => {
        const graphQlData = JSON.parse(data).og_object;
        return (graphQlData ? graphQlData.engagement.count : 0);
    },
    popupWidth: 555,
    popupHeight: 555,
    popupUrl: 'https://www.facebook.com/sharer.php?u={url}',
    knownParams: ['url', 'hashtag', 'counter'],
    svgIconPath: 'M16.000,8.049 C16.000,3.629 12.418,0.047 8.000,0.047 C3.582,0.047 -0.000,3.629 -0.000,8.049 C-0.000,12.043 2.925,15.353 6.750,15.953 L6.750,10.362 L4.719,10.362 L4.719,8.049 L6.750,8.049 L6.750,6.286 C6.750,4.280 7.944,3.173 9.772,3.173 C10.647,3.173 11.563,3.329 11.563,3.329 L11.563,5.298 L10.554,5.298 C9.560,5.298 9.250,5.915 9.250,6.548 L9.250,8.049 L11.469,8.049 L11.114,10.362 L9.250,10.362 L9.250,15.953 C13.075,15.353 16.000,12.043 16.000,8.049z',
};
