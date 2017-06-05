/**
 * Odnoklassniki service provider
 */

import { getScript, global } from '../dom';
import { makeUrl, set } from '../utils';

const odnoklassniki = {
    counterUrl: 'https://connect.ok.ru/dk?st.cmd=extLike&ref={url}&uid={index}',
    counter(url, promise) {
        this.promises.push(promise);

        getScript(makeUrl(url, {
            index: this.promises.length - 1,
        }));
    },
    promises: [],
    popupUrl: 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki&st.shareUrl={url}',
    popupWidth: 640,
    popupHeight: 400,
};

set(global, 'ODKL.updateCount', (index, counter) => {
    odnoklassniki.promises[index](counter);
});

export default odnoklassniki;
