import likely from './index.js';
import utils from './utils';

/**
 * History
 * @type {Object}
 */
const history = {
    /**
     * Called everytime the page url's been changed.
     * Reinits all widgets with the new page url.
     * @type {Function}
     */
    onUrlChange() {
        likely.initiate({
            forceUpdate: true,
            url: utils.getDefaultUrl(),
        });
    },
    /**
     * Inits pust/pop state events listeners
     * @type {Function}
     */
    init() {
        const pushState = window.history.pushState;
        window.history.pushState = function () {
            // browser should change the url first
            setTimeout(this.onUrlChange.bind(this), 0);
            return pushState.apply(window.history, arguments);
        }.bind(this);

        const replaceState = window.history.replaceState;
        window.history.replaceState = function () {
            setTimeout(this.onUrlChange.bind(this), 0);
            return replaceState.apply(window.history, arguments);
        }.bind(this);

        window.addEventListener('popstate', this.onUrlChange.bind(this));
    },
};

export default history;
