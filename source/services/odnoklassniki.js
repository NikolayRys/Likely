/**
 * Odnoklassniki service provider
 */

import { interpolateUrl, registerGlobalCallback } from '../utils';
import { loadScript } from '../dom';

const odnoklassniki = {
    counterUrl: 'https://connect.ok.ru/dk?st.cmd=extLike&ref={url}&uid={index}',
    fetch(updateBroadcaster) {
        this.broadcasters.push(updateBroadcaster);
        loadScript(interpolateUrl(updateBroadcaster.url, {
            index: this.broadcasters.length - 1,
        }));
    },
    broadcasters: [],
    popupUrl: 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki&st.shareUrl={url}',
    popupWidth: 640,
    popupHeight: 400,
    knownParams: ['url'],
    svgIconPath: '9.070,10.645 C8.328,11.113 7.520,11.438 6.674,11.633 L8.979,13.947 C9.448,14.427 9.448,15.194 8.979,15.662 C8.497,16.130 7.729,16.130 7.260,15.662 L4.980,13.388 L2.714,15.662 C2.480,15.896 2.167,16.013 1.854,16.013 C1.542,16.013 1.229,15.896 0.995,15.662 C0.526,15.181 0.526,14.414 0.995,13.947 L3.313,11.633 C2.480,11.451 1.659,11.113 0.917,10.645 C0.356,10.294 0.187,9.553 0.539,8.981 C0.890,8.422 1.633,8.254 2.206,8.604 C3.899,9.670 6.088,9.670 7.781,8.604 C8.341,8.241 9.097,8.409 9.448,8.981 C9.813,9.540 9.631,10.294 9.070,10.645 ZM5.007,8.266 C2.714,8.266 0.864,6.408 0.864,4.133 C0.864,1.846 2.714,-0.000 5.007,-0.000 C7.299,-0.000 9.149,1.859 9.149,4.133 C9.149,6.421 7.286,8.266 5.007,8.266 ZM5.007,2.431 C4.056,2.431 3.287,3.184 3.287,4.146 C3.287,5.082 4.069,5.849 5.007,5.849 C5.957,5.849 6.726,5.082 6.726,4.146 C6.726,3.197 5.957,2.431 5.007,2.431'
};

// Gets called by the script provided by the service
registerGlobalCallback('ODKL.updateCount', (index, counter) => {
    odnoklassniki.broadcasters[index].trigger(counter);
});

export default odnoklassniki;
