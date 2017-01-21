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
    let originalWindowHandle;
    let openedUrl;

    // clickTarget can be either a selector or a node
    const realClickTarget = typeof clickTarget === 'string' ? driver.findElement({ css: clickTarget }) : clickTarget;

    return realClickTarget.click()
        .then(() => Promise.all([
            driver.getWindowHandle(),
            driver.getAllWindowHandles(),
        ]))
        .then(([currentHandle, handles]) => {
            console.debug('originalWindowHandle', originalWindowHandle);
            console.debug('handles', handles);
            originalWindowHandle = currentHandle;

            const newWindowHandle = handles.find((handle) => handle !== currentHandle);
            console.debug('newWindowHandle', newWindowHandle);
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
        .then(() => {
            return driver.getAllWindowHandles().then((allHandles) => {
                console.debug('allHandles after closing', allHandles);
                console.debug('originalWindowHandle after closing', originalWindowHandle);
                return driver.switchTo().window(originalWindowHandle);
            });
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
