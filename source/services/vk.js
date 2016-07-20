/**
 * Vkontakte service provider
 */

import dom from '../dom';
import utils from '../utils';

const vkontakte = {
    counterUrl: 'https://vk.com/share.php?act=count&url={url}&index={index}',
    counter(url, promise) {
        this.promises.push(promise);

        dom.getScript(utils.makeUrl(url, {
            index: this.promises.length - 1,
        }));
    },
    promises: [],
    popupUrl: 'https://vk.com/share.php?url={url}&title={title}',
    popupWidth: 550,
    popupHeight: 330,
};

utils.set(window, 'VK.Share.count', (index, count) => {
    vkontakte.promises[index](count);
});

export default vkontakte;
