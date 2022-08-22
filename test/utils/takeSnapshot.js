'use strict';

const fs = require('fs');

function printError(err) {
    if (err) {
        console.log(err);
    }
}

async function takeSnapshot(driver, filename) {
    const screenshot = await driver.takeScreenshot();
    const pageSource = await driver.getPageSource();

    const writableScreenshot = screenshot.replace(/^data:image\/png;base64,/, '');
    await fs.writeFile(filename + '.png', writableScreenshot, 'base64', printError);
    await fs.writeFile(filename + '.html', pageSource, printError);
}

module.exports = takeSnapshot;
