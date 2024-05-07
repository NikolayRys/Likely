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
 * @param {object} serviceOptions
 */
export default (serviceOptions) => {
    // __likelyFetchMock is used for UI testing and is set on window
    // because this function is executed right when Likely is loaded.
    // There’s currently no way to do `likely.__likelyFetchMock = ...`
    // before running this method.
    serviceOptions.fetch = global.__likelyFetchMock || serviceOptions.fetch || fetchXHR;
    serviceOptions.urlCallback = serviceOptions.urlCallback || (()=>{ /* no-op */ });
    serviceOptions.knownParams = serviceOptions.knownParams || [];
    serviceOptions.openPopup = serviceOptions.openPopup === undefined ? true : serviceOptions.openPopup;
    serviceOptions.resetBroadcasters = resetBroadcasters;
    serviceOptions.resetBroadcasters();
};
