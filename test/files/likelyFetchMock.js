'use strict'; // eslint-disable-line strict

window.__likelyFetchMock = function (broadcaster) {
    broadcaster.trigger(10);
};
