import { getDefaultUrl } from './utils';
import likely from './index.js';

/**
 * Called everytime the page url's been changed.
 * Reinits all widgets with the new page url.
 * @type {Function}
 */
const onUrlChange = () => {
    likely.initiate({
        forceUpdate: true,
        url: getDefaultUrl(),
    });
};

/**
 * Inits pust/pop state events listeners
 * @type {Function}
 */
const initHistory = () => {
    const pushState = window.history.pushState;
    window.history.pushState = function () {
        // browser should change the url first
        setTimeout(onUrlChange.bind(this), 0);
        return pushState.apply(window.history, arguments);
    }.bind(this);

    const replaceState = window.history.replaceState;
    window.history.replaceState = function () {
        setTimeout(onUrlChange.bind(this), 0);
        return replaceState.apply(window.history, arguments);
    }.bind(this);

    window.addEventListener('popstate', onUrlChange);
};

export default initHistory;
