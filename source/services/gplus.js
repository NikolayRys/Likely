/**
 * Google+ service provider
 */

export default {
    counterUrl: 'https://clients6.google.com/rpc',
    counter(counterUrl, callback, sharedUrl) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', counterUrl);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.addEventListener('load', () => {
            const plusOneCount = JSON.parse(xhr.responseText)[0].result.metadata.globalCounts.count;
            callback(plusOneCount);
        });

        xhr.send(JSON.stringify([{
            method: 'pos.plusones.get',
            id: 'p',
            params: {
                nolog: true,
                id: sharedUrl,
                source: 'widget',
                userId: '@viewer',
                groupId: '@self',
            },
            jsonrpc: '2.0',
            key: 'p',
            apiVersion: 'v1',
        }]));
    },
    popupUrl: 'https://plus.google.com/share?url={url}',
    popupWidth: 700,
    popupHeight: 500,
};
