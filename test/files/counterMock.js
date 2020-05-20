'use strict'; // eslint-disable-line strict

window.__likelyFetchMock = function (updateBroadcaster) {
    updateBroadcaster.trigger(10);
};
