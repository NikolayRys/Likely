/**
 * Vkontakte service provider
 */

import { getScript, global } from '../dom';
import { makeUrl, set } from '../utils';

const vkontakte = {
    counterUrl: 'https://vk.com/share.php?act=count&url={url}&index={index}',
    counter(url, promise) {
        this.promises.push(promise);

        getScript(makeUrl(url, {
            index: this.promises.length - 1,
        }));
    },
    promises: [],
    popupUrl: 'https://vk.com/share.php?url={url}&title={title}',
    popupWidth: 550,
    popupHeight: 330,
};

set(global, 'VK.Share.count', (index, count) => {
    vkontakte.promises[index](count);
});

export default vkontakte;
