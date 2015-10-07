/**
 * Configuration
 */

var secure = window.location.protocol === "https:";

module.exports = {
    name:      "likely",
    prefix:    "likely__",
    secure:    secure,
    protocol:  secure ? "https:" : "http:"
};