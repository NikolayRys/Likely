/**
 * VK service provider
 * Doc: https://vk.com/dev/widget_share
 * (Switch to Russian language, the English docs are incomplete)
 * VK own implementation: https://vk.com/js/api/share.js
 */

import { interpolateUrl, registerGlobalCallback } from '../utils';
import { loadJSONP } from '../dom';

const vkontakte = {
    popupWidth: 650,
    popupHeight: 570,
    counterUrl: 'https://vk.com/share.php?act=count&url={url}&index={index}',
    fetch(broadcaster) {
        const index = Object.keys(this.broadcastersByUrl).length - 1;
        loadJSONP(interpolateUrl(broadcaster.url, { index: index }));
    },
    popupUrl: 'https://vk.com/share.php?url={url}&title={title}',
    knownParams: ['url', 'title', 'image', 'comment', 'counter'],
    svgIconPath: 'M8.71453 12.9837C3.24794 12.9837 0.129919 9.23611 0 3H2.73828C2.82823 7.57714 4.84693 9.51592 6.44591 9.91565V3H9.02439V6.94751C10.6034 6.77762 12.2622 4.97876 12.8218 3H15.4003C14.9705 5.43847 13.1717 7.23734 11.8925 7.97687C13.1717 8.5765 15.2205 10.1455 16 12.9837H13.1617C12.5521 11.0849 11.0331 9.61584 9.02439 9.41597V12.9837H8.71453z',
};

// Script, returned by VK, calls this method with two arguments
registerGlobalCallback('VK.Share.count', (index, count) => {
    const broadcasters = vkontakte.broadcastersByUrl;
    broadcasters[Object.keys(broadcasters)[index]].trigger(count);
});

export default vkontakte;
