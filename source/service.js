import { global } from './dom';

function fetchXHR(updateBroadcaster) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const convertedNumber = typeof this.convertNumber === 'function' ? this.convertNumber(xhr.responseText) : xhr.responseText;
            updateBroadcaster.trigger(convertedNumber);
        }
    };
    xhr.open('GET', updateBroadcaster.url, true);
    xhr.send();
}

function resetBroadcasters() {
    this.broadcastersByUrl = {};
}

/**
 * Set default values on service option object
 * @param {Object} options
 */
export default (options) => {
    // __likelyFetchMock is used for UI testing and is set on window
    // because this function is executed right when Likely is loaded.
    // There’s currently no way to do `likely.__likelyFetchMock = ...`
    // before running this method.
    options.fetch = global.__likelyFetchMock || options.fetch || fetchXHR;
    options.urlCallback = options.urlCallback || (()=>{ /* no-op */ });
    options.knownParams = options.knownParams || [];
    options.openPopup = options.openPopup === undefined ? true : options.openPopup;
    options.resetBroadcasters = resetBroadcasters;
    options.resetBroadcasters();
};
