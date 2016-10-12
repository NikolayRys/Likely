/* eslint-env node, mocha, es6 */

'use strict';

const { before, after, beforeEach, describe, it } = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

require('geckodriver');
const selenium = require('selenium-webdriver');
const until = require('selenium-webdriver/lib/until');

const StaticServer = require('static-server');

const commonTimeout = 20000;

describe('Likely', function () {
    let driver;

    // The timeout is used to handle the browser starting long for the first time
    // and sharing dialogs taking too long to load on a slow network
    this.timeout(commonTimeout);

    before(function () {
        driver = new selenium.Builder()
            .forBrowser('firefox')
            .build();

        new StaticServer({
            rootPath: `${__dirname}/..`,
            port: 1337,
            host: '127.0.0.1'
        }).start();
    });

    after(function () {
        return driver.quit();
    });

    describe('fetching counters', function () {
        before(function () {
            return getLikely(driver, 'http://127.0.0.1:1337/test/files/autoinit.html', { waitUntilInitialized: true });
        });

        const testedServices = [
            { name: 'Facebook', likelyName: 'facebook' },
            { name: 'Google+', likelyName: 'gplus' },
            { name: 'Odnoklassniki', likelyName: 'odnoklassniki' },
            { name: 'Pinterest', likelyName: 'pinterest' },
            { name: 'VK', likelyName: 'vkontakte' },
        ];

        testedServices.forEach(({ name, likelyName }) => {
            it(`should fetch the counters for ${name}`, function () {
                const mockedCounterValue = '10';
                return expectToContainText(driver, `.likely__counter_${likelyName}`, mockedCounterValue);
            });
        });
    });

    describe('opening sharing dialogs', function () {
        before(function () {
            return getLikely(driver, 'http://127.0.0.1:1337/test/files/autoinit.html', { waitUntilInitialized: true });
        });

        const testedServices = [
            { name: 'Facebook', likelyName: 'facebook', urlRegex: /facebook\.com/ },
            { name: 'Google+', likelyName: 'gplus', urlRegex: /plus\.google\.com/ },
            { name: 'Odnoklassniki', likelyName: 'odnoklassniki', urlRegex: /ok\.ru/ },
            { name: 'Pinterest', likelyName: 'pinterest', urlRegex: /pinterest\.com/ },
            { name: 'Telegram', likelyName: 'telegram', urlRegex: /telegram\.me/ },
            { name: 'Twitter', likelyName: 'twitter', urlRegex: /twitter\.com/ },
            { name: 'VK', likelyName: 'vkontakte', urlRegex: /vk\.com/ },
        ];

        testedServices.forEach(({ name, likelyName, urlRegex }) => {
            it(`should open the sharing dialog for ${name}`, function () {
                return expectClickToOpen(driver, `.likely__widget_${likelyName}`, urlRegex);
            });
        });
    });

    describe('configuration', function () {
        beforeEach(function () {
            return getLikely(driver, 'http://127.0.0.1:1337/test/files/no-autoinit.html');
        });

        it('should change the shared URL when `<link rel="canonical">` is specified', function () {
            return driver.executeScript(`
                document.head.innerHTML += '<link rel="canonical" href="https://google.com">';
                likely.initiate();
            `).then(() => {
                return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*google\.com/);
            });
        });

        it('should change the shared URL when `data-url` is specified', function () {
            return driver.executeScript(`
                document.querySelector('.likely').setAttribute('data-url', 'https://google.com');
                likely.initiate();
            `).then(() => {
                return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*google\.com/);
            });
        });

        it('should change the shared title when `data-title` is specified', function () {
            return driver.executeScript(`
                document.querySelector('.likely').setAttribute('data-title', 'Fake Title');
                likely.initiate();
            `).then(() => {
                return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*Fake%20Title/);
            });
        });

        it('should set the `via` when `data-via` on the Twitter button is specified', function () {
            return driver.executeScript(`
                document.querySelector('.twitter').setAttribute('data-via', 'horse_js');
                likely.initiate();
            `).then(() => {
                return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*horse_js/);
            });
        });

        it('should set the shared text when `data-text` on the Telegram button is specified', function () {
            return driver.executeScript(`
                document.querySelector('.telegram').setAttribute('data-text', 'Fake Text');
                likely.initiate();
            `).then(() => {
                return expectClickToOpen(driver, '.likely__widget_telegram', /telegram\.me\/.*Fake%20Text/);
            });
        });

        it('should change the default image when the `data-media` on the Pinterest button is specified', function () {
            return driver.executeScript(`
                document.querySelector('.pinterest').setAttribute('data-media', 'http://i.imgur.com/zunNbfY.jpg');
                likely.initiate();
            `).then(() => {
                return expectClickToOpen(driver, '.likely__widget_pinterest', /pinterest\.com\/.*zunNbfY\.jpg/);
            });
        });
    });

    describe('history', function () {
        const testHistoryMethod = (driver, methodName) => {
            // `methodName` is either "pushState" or "replaceState"

            const targetUrl = '/?history';

            return getLikely(driver, 'http://127.0.0.1:1337/test/files/autoinit.html', { waitUntilInitialized: true })
                .then(() => {
                    return driver.executeScript(`window.history.${methodName}(null, null, '${targetUrl}');`);
                })
                .then(() => {
                    return expectClickToOpen(
                        driver,
                        '.likely__widget_twitter',
                        new RegExp(`twitter\\.com\\/.*${encodeURIComponent(targetUrl)}`)
                    );
                });
        };

        it('should change the shared URL when history.pushState() is called', function () {
            return testHistoryMethod(driver, 'pushState');
        });

        it('should change the shared URL when history.replaceState() is called', function () {
            return testHistoryMethod(driver, 'replaceState');
        });

        // Skipped until #94 is resolved
        it.skip('should change the shared URL when the browser’s back button is clicked', function () {
            return getLikely(driver, 'http://127.0.0.1:1337/test/files/autoinit.html')
                .then(() => {
                    return driver.executeScript(`
                        window.history.pushState(null, null, '/?history');
                        likely.initiate();
                    `);
                })
                .then(() => {
                    return driver.navigate().back();
                })
                .then(() => {
                    return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*\/no-autoinit\.html/);
                });
        });
    });

    describe('bugs', function () {
        it('should get a correct title when the script is placed before the title element [#67]', function () {
            return getLikely(driver, 'http://127.0.0.1:1337/test/files/issues/67.html', { waitUntilInitialized: true })
                .then(() => {
                    return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*Likely%20test%20page/);
                });
        });
    });
});

function getLikely(driver, url, { waitUntilInitialized = false } = {}) {
    const pagePromise = driver.get(url);

    if (waitUntilInitialized) {
        return pagePromise
            .then(() => {
                return driver.wait(until.elementLocated({ css: '.likely_ready' }), 1500);
            });
    }
    else {
        return pagePromise;
    }
}

function expectToContainText(driver, selector, value) {
    return expect(driver.findElement({ css: selector }).getText()).to.eventually.equal(value);
}

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
            const urlChangeTimeout = commonTimeout;
            return driver.wait(until.urlMatches(windowUrlRegex), urlChangeTimeout);
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
