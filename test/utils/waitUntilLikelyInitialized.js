'use strict';

const until = require('selenium-webdriver/lib/until');

function waitUntilLikelyInitialized(driver) {
    return driver.wait(until.elementLocated({ css: '.likely_ready' }), 500)
        .then(() => driver.findElement({ css: '.likely_ready' }))
        .then((el) => driver.wait(until.elementIsVisible(el), 500));
}

module.exports = waitUntilLikelyInitialized;
