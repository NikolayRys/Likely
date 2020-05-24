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
    svgIconPath: 'm10.4615.1007h-4.86709c-4.44196 0-5.493711 1.05175-5.493711 5.49371v4.86709c0 4.442 1.051751 5.4937 5.493711 5.4937h4.86709c4.442 0 5.4937-1.0517 5.4937-5.4937v-4.86709c0-4.44196-1.0517-5.49371-5.4937-5.49371zm2.2714 5.03496c.3468 0 .4251.17902.3468.42518-.1222.56413-1.1373 2.0606-1.4516 2.52409-.0598.08807-.0942.13884-.0924.13884-.1231.2014-.1679.29091 0 .51469.0606.08274.1893.20898.3363.35325.1512.1484.3219.31588.4581.47472.4923.55947.8727 1.02937.9734 1.35387.0895.3245-.0671.4923-.4028.4923h-1.1524c-.3055 0-.4629-.1754-.7984-.5492-.1439-.1603-.3205-.357-.5555-.5921-.68251-.66011-.98461-.74962-1.15244-.74962-.23497 0-.3021.05594-.3021.3916v1.04052c0 .2798-.08951.4476-.82797.4476-1.21958 0-2.57343-.7385-3.52448-2.11469-1.43217-2.01399-1.82377-3.53566-1.82377-3.83776 0-.16783.05594-.32448.3916-.32448h1.16364c.29091 0 .4028.12308.51469.44756.57063 1.64475 1.52168 3.08811 1.91328 3.08811.14546 0 .21259-.06714.21259-.43637v-1.7007c-.02762-.4834-.1959-.69402-.32069-.8502-.07739-.09687-.13805-.17279-.13805-.27987 0-.13426.11189-.26853.29091-.26853h1.81259c.24615 0 .33566.13427.33566.42518v2.2937c0 .24616.1007.33567.17902.33567.14546 0 .26853-.08951.53706-.35804.82796-.92868 1.42096-2.36084 1.42096-2.36084.0783-.16783.2126-.32448.5035-.32448z',
};

// Gets called by the script provided by the service
registerGlobalCallback('VK.Share.count', (index, count) => {
    vkontakte.broadcasters[index].trigger(count);
});

export default vkontakte;
