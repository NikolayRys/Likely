// This is a wrapper around `index-es.js` and an entry point for the CommonJS environment bundle.
// It re-exports the Likely default export without the `.default` field.

module.exports = require('./index-commonjs-es').default;
