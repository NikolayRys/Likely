import { renameKey } from '../utils';
/**
 * Odnoklassniki service provider
 * Docs: https://apiok.ru/en/ext/like
 * https://connect.ok.ru/connect.js
 */

export default {
    name: 'odnoklassniki',
    counterUrl: 'https://connect.ok.ru/dk?st.cmd=extLike&tp=json&ref={url}',
    convertNumber: (json) => JSON.parse(json).count,
    urlCallback() {
        // "this" here is an object of the LikelyButton class
        renameKey(this.sourceElement.dataset, 'imageurl', 'imageUrl');
    },
    popupWidth: 588,
    popupHeight: 296,
    popupUrl: 'https://connect.ok.ru/offer?url={url}&title={title}',
    knownParams: ['url', 'title', 'imageurl', 'counter'],
    svgIconPath: 'M12.1,10.6c-0.7,0.5-1.5,0.8-2.4,1l2.3,2.3c0.5,0.5,0.5,1.2,0,1.7c-0.5,0.5-1.2,0.5-1.7,0L8,13.4l-2.3,2.3 C5.5,15.9,5.2,16,4.9,16c-0.3,0-0.6-0.1-0.9-0.4c-0.5-0.5-0.5-1.2,0-1.7l2.3-2.3c-0.8-0.2-1.7-0.5-2.4-1C3.4,10.3,3.2,9.6,3.5,9 c0.4-0.6,1.1-0.7,1.7-0.4c1.7,1.1,3.9,1.1,5.6,0c0.6-0.4,1.3-0.2,1.7,0.4C12.8,9.5,12.6,10.3,12.1,10.6z M8,8.3 c-2.3,0-4.1-1.9-4.1-4.1C3.9,1.8,5.7,0,8,0c2.3,0,4.1,1.9,4.1,4.1C12.1,6.4,10.3,8.3,8,8.3z M8,2.4c-1,0-1.7,0.8-1.7,1.7 c0,0.9,0.8,1.7,1.7,1.7c0.9,0,1.7-0.8,1.7-1.7C9.7,3.2,9,2.4,8,2.4z',
};
