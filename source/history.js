const callbacks = [];
const handleUrlChange = () => {
    callbacks.forEach((callback) => {
        callback();
    });
};

const setupHistoryWatcher = () => {
    const pushState = window.history.pushState;
    window.history.pushState = function () {
        // browser should change the url first
        setTimeout(handleUrlChange, 0);
        return pushState.apply(window.history, arguments);
    };

    const replaceState = window.history.replaceState;
    window.history.replaceState = function () {
        // browser should change the url first
        setTimeout(handleUrlChange, 0);
        return replaceState.apply(window.history, arguments);
    };

    window.addEventListener('popstate', handleUrlChange);
};

let isWatchingHistory = false;


/**
 * Monitoring tool for catching url changes for re-initiating widged with a new url
 * @param {Function} callback
 */
const history = {
    onUrlChange(callback) {
        if (!isWatchingHistory) {
            setupHistoryWatcher();
            isWatchingHistory = true;
        }

        callbacks.push(callback);
    },
};

export default history;
