const expect = require('chai').use(require('chai-as-promised')).expect;
const until = require('selenium-webdriver/lib/until');

function expectToContainText(driver, selector, value) {
    return expect(driver.findElement({ css: selector }).getText()).to.eventually.equal(value);
}

/**
 * @param {WebDriver} driver
 * @param {WebElement | string} clickTarget Either a Selenium WebElement that should be clicked,
 *  or a selector for this element
 * @param {RegExp} windowUrlRegex A regular expression that will be matched with opened window url.
 *  If it matches, the expectation is considered confirmed, otherwise it’s considered refuted.
 * @returns {Promise.<undefined>} Promise that resolves when the
 */
async function expectClickToOpen(driver, clickTarget, windowUrlRegex) {
    let currentHandles;
    const originalWindow = await driver.getWindowHandle();

    await clickTarget.click();
    // Set a timeout to wait until the new window opens. This lowers the amount of random crashes in Travis
    await driver.wait(async () => {
        currentHandles = await driver.getAllWindowHandles();
        return currentHandles.length > 1;
    }, 5000);

    const handles = await driver.getAllWindowHandles();
    const newWindowHandle = handles.find((handle) => handle !== originalWindow);
    await driver.switchTo().window(newWindowHandle);

    try {
        // `driver.wait()` is used because Firefox opens a new window with `about:blank' initially
        // This time should be enough for Firefox to load something and replace `about:blank` with the target URL
        await driver.wait(until.urlMatches(windowUrlRegex), 2000);
    }
    catch (_e) {
        // `driver.wait()` triggers an exception if the url doesn’t match the regex,
        // but we actually ignore this exception and do the proper URL comparison later
    }

    const openedUrl = await driver.getCurrentUrl();
    await driver.close();
    // We compare the URLs only after closing the dialog and switching back to the main window.
    // If we do it before and the comparison fails, Selenium will continue working in the opened dialog.
    // This will make all the following tests fail
    await driver.switchTo().window(originalWindow);

    if (!windowUrlRegex.test(openedUrl)) {
        console.log(`Opened URL: ${openedUrl}`);
        console.log(`Expected URL: ${windowUrlRegex}`);
    }

    return expect(openedUrl).to.match(windowUrlRegex);
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
exports.expectClickToOpen = expectClickToOpen;
exports.expectToContainText = expectToContainText;
