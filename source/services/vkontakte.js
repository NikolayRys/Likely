/**
 * VK service provider
 */

import { interpolateUrl, registerGlobalCallback } from '../utils';
import { loadScript } from '../dom';

const vkontakte = {
    counterUrl: 'https://vk.com/share.php?act=count&url={url}&index={index}',
    fetch(updateBroadcaster) {
        this.broadcasters.push(updateBroadcaster);
        loadScript(interpolateUrl(updateBroadcaster.url, {
            index: this.broadcasters.length - 1,
        }));
    },
    broadcasters: [],
    popupUrl: 'https://vk.com/share.php?url={url}&title={title}',
    popupWidth: 550,
    popupHeight: 330,
    knownParams: ['url', 'title', 'image', 'description'],
    svgIconPath: '15.632 3.914 C 15.743 3.545 15.632 3.273 15.102 3.273 L 13.351 3.273 C 12.906 3.273 12.701 3.508 12.59 3.766 C 12.59 3.766 11.699 5.926 10.438 7.329 C 10.03 7.736 9.845 7.865 9.622 7.865 C 9.511 7.865 9.35 7.736 9.35 7.367 L 9.35 3.914 C 9.35 3.471 9.221 3.273 8.85 3.273 L 6.099 3.273 C 5.82 3.273 5.653 3.479 5.653 3.674 C 5.653 4.094 6.284 4.191 6.349 5.373 L 6.349 7.939 C 6.349 8.501 6.247 8.604 6.024 8.604 C 5.431 8.604 3.987 6.434 3.131 3.951 C 2.963 3.468 2.795 3.273 2.347 3.273 L 0.597 3.273 C 0.096 3.273 -0.004 3.508 -0.004 3.766 C -0.004 4.228 0.59 6.517 2.76 9.545 C 4.206 11.613 6.245 12.734 8.099 12.734 C 9.212 12.734 9.35 12.484 9.35 12.056 L 9.35 10.493 C 9.35 9.995 9.455 9.896 9.808 9.896 C 10.067 9.896 10.513 10.025 11.551 11.022 C 12.738 12.203 12.934 12.734 13.602 12.734 L 15.352 12.734 C 15.852 12.734 16.103 12.484 15.958 11.993 C 15.8 11.504 15.234 10.793 14.482 9.951 C 14.074 9.471 13.461 8.954 13.276 8.696 C 13.016 8.363 13.091 8.216 13.276 7.92 C 13.276 7.92 15.409 4.929 15.632 3.914',
};

// Gets called by the script provided by the service
registerGlobalCallback('VK.Share.count', (index, count) => {
    vkontakte.broadcasters[index].trigger(count);
});

export default vkontakte;
