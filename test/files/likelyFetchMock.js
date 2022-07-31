'use strict'; // eslint-disable-line strict

window.__likelyFetchMock = function (broadcaster) {
    window.__likelyFetchMock.calls++;
    broadcaster.trigger(window.__likelyFetchMock.stubbedValue);
};

window.__likelyFetchMock.stubbedValue = 10;
window.__likelyFetchMock.calls = 0;
