'use strict';

const until = require('selenium-webdriver/lib/until');

async function waitUntilLikelyInitialized(driver) {
    await driver.wait(until.elementLocated({ css: '.likely_ready' }), 2000);
    const rootElement = await driver.findElement({ css: '.likely_ready' });
    await driver.wait(until.elementIsVisible(rootElement), 2000);
}

module.exports = waitUntilLikelyInitialized;
