const StaticServer = require('static-server');
const fs = require('fs');

function startServer() {
    new StaticServer({
        rootPath: `${__dirname}/../..`,
        port: 1337,
        host: '127.0.0.1',
    }).start();
}

function printError(err) {
    if (err) {
        console.log(err);
    }
}

async function takeScreenshot(driver, filename) {
    const screenshot = await driver.takeScreenshot();
    const pageSource = await driver.getPageSource();

    const writableScreenshot = screenshot.replace(/^data:image\/png;base64,/, '');
    await fs.writeFile(filename + '.png', writableScreenshot, 'base64', printError);
    await fs.writeFile(filename + '.html', pageSource, printError);
}

const LikelyPage = {
    AUTOINIT: 'autoinit.html',
    NO_AUTOINIT: 'no-autoinit.html',
    NO_AUTOINIT_MULTIPLE: 'no-autoinit-multiple.html',
    ISSUE_67: 'issues/67.html',
    ISSUE_145: 'issues/disable-counters-issue-145.html',
};

function getLikelyPage(driver, pageName) {
    return driver.get('http://127.0.0.1:1337/test/files/' + pageName);
}

exports.LikelyPage = LikelyPage;
exports.getLikelyPage = getLikelyPage;
exports.takeSnapshot = takeScreenshot;
exports.startServer = startServer;
