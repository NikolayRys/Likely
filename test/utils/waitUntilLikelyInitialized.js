'use strict';

const until = require('selenium-webdriver/lib/until');

function waitUntilLikelyInitialized(driver) {
    return driver.wait(until.elementLocated({ css: '.likely-button_visibility_visible' }), 1500);
}

module.exports = waitUntilLikelyInitialized;
