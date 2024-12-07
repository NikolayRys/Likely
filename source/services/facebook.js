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
    svgIconPath: 'M 16 8 C 16 3.582031 12.417969 0 8 0 C 3.582031 0 0 3.582031 0 8 C 0 11.753906 2.582031 14.898438 6.066406 15.765625 L 6.066406 10.445312 L 4.417969 10.445312 L 4.417969 8 L 6.066406 8 L 6.066406 6.945312 C 6.066406 4.222656 7.300781 2.960938 9.972656 2.960938 C 10.480469 2.960938 11.355469 3.0625 11.710938 3.160156 L 11.710938 5.375 C 11.523438 5.355469 11.195312 5.347656 10.789062 5.347656 C 9.476562 5.347656 8.96875 5.84375 8.96875 7.132812 L 8.96875 8 L 11.582031 8 L 11.132812 10.445312 L 8.96875 10.445312 L 8.96875 15.941406 C 12.929688 15.460938 16 12.089844 16 8 Z M 16 8',
};
