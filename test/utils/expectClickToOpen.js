/* eslint-env node, mocha, es6 */

'use strict';

const expect = require('chai').use(require('chai-as-promised')).expect;
const until = require('selenium-webdriver/lib/until');

function expectClickToOpen(driver, clickTargetSelector, windowUrlRegex) {
    let originalWindowHandle;
    let openedUrl;

    return driver.findElement({ css: clickTargetSelector }).click()
        .then(() => Promise.all([
            driver.getWindowHandle(),
            driver.getAllWindowHandles(),
        ]))
        .then(([currentHandle, handles]) => {
            originalWindowHandle = currentHandle;

            const newWindowHandle = handles.find(handle => handle !== currentHandle);
            return driver.switchTo().window(newWindowHandle);
        })
        // `driver.wait()` is used because Firefox opens a new window with `about:blank' initially
        .then(() => {
            // This time should be enough for Firefox to load something and replace `about:blank` with the target URL
            return driver.wait(until.urlMatches(windowUrlRegex), 10000);
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
            return driver.switchTo().window(originalWindowHandle);
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
