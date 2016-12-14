import likely from './index.js';

window.addEventListener('load', () => {
    likely.initiate();
});

// `module.exports` instead of `export default`:
// public API should be `likely.initiate`, not `likely.default.initiate`
module.exports = likely;
