// This is a wrapper around `index-browser-es.js` and an entry point for the browser bundle.
// It re-exports the Likely default export without the `.default` field.

module.exports = require('./index-browser-es').default;