/* eslint-env node, mocha, es6 */

'use strict';

const expect = require('chai').use(require('chai-as-promised')).expect;
const until = require('selenium-webdriver/lib/until');

/**
 * @param {WebDriver} driver
 * @param {WebElement|String} clickTarget Either a Selenium WebElement that should be clicked,
 *  or a selector for this element
 * @param {RegExp} windowUrlRegex A regular expression that will be matched with opened window url.
 *  If it matches, the expectation is considered confirmed, otherwise it’s considered refuted.
 * @returns {Promise.<undefined>} Promise that resolves when the
 */
function expectClickToOpen(driver, clickTarget, windowUrlRegex) {
    let openedUrl;

    // clickTarget can be either a selector or a node
    const realClickTarget = typeof clickTarget === 'string' ? driver.findElement({ css: clickTarget }) : clickTarget;

    return realClickTarget.click()
        // Set a timeout to wait until the new window opens. This lowers the amount of random crashes in Travis
        .then(() => {
            return new Promise((resolve) => setTimeout(resolve, 200));
        })
        .then(() => Promise.all([
            driver.getWindowHandle(),
            driver.getAllWindowHandles(),
        ]))
        .then(([currentHandle, handles]) => {
            const newWindowHandle = handles.find((handle) => handle !== currentHandle);
            return driver.switchTo().window(newWindowHandle);
        })
        // `driver.wait()` is used because Firefox opens a new window with `about:blank' initially
        .then(() => {
            // This time should be enough for Firefox to load something and replace `about:blank` with the target URL
            return driver.wait(until.urlMatches(windowUrlRegex), 2000);
        })
        // `driver.wait()` triggers an exception if the url doesn’t match the regex,
        // but we actually ignore this exception and do the proper URL comparison later
        .then(
            () => driver.getCurrentUrl(),
            () => driver.getCurrentUrl()
        )
        .then((url) => {
            openedUrl = url;

            return driver.close();
        })
        .then(() => driver.getAllWindowHandles())
        .then(([primaryWindowHandle]) => {
            return driver.switchTo().window(primaryWindowHandle);
        })
        // We compare the URLs only after closing the dialog and switching back to the main window.
        // If we do it before and the comparison fails, all the `.then()` branches won’t execute,
        // and Selenium will continue working in the opened dialog.
        // This will make all the following tests fail
        .then(() => {
            expect(openedUrl).to.match(windowUrlRegex);
        });
}

module.exports = expectClickToOpen;
