/**
 * Configuration
 */

module.exports = {
    name:      "likely",
    prefix:    "likely__",
    secure:    window.location.protocol === "https:",
    protocol:  window.location.protocol === "https:" ? "https:" : "http:"
};