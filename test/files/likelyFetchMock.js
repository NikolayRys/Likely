'use strict'; // eslint-disable-line strict

window.__likelyFetchMock = function (broadcaster) {
    window.__likelyFetchMock.calls++;
    broadcaster.trigger(10);
};
window.__likelyFetchMock.calls = 0;
