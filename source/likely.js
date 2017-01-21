// This module is an entry point when `likely.js` is just dropped into the browser.
// It’s written with CommonJS imports and exports to make possible doing `module.exports = likely`.
// This is required so that users work with `window.likely`, not `window.likely.default`

const likely = require('./index.js');

window.addEventListener('load', () => {
    likely.initiate();
});

module.exports = likely;
