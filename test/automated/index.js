/* eslint-env node, mocha, es6 */

'use strict';

const { before, after, beforeEach, describe, it } = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

require('chromedriver');
const selenium = require('selenium-webdriver');
const until = require('selenium-webdriver/lib/until');

describe('Likely', function () {
    let driver;

    // The timeout is used to handle the browser starting long for the first time
    // and sharing dialogs taking too long to load on a slow network
    this.timeout(20000);

    before(function () {
        driver = new selenium.Builder()
            .forBrowser('chrome')
            .build();
    });

    after(function () {
        return driver.quit();
    });

    describe('fetching counters', function () {
        before(function () {
            return getLikely(driver, 'http://ilyabirman.github.io/Likely/autoinit.html', { waitUntilInitialized: true })
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
            return getLikely(driver, 'http://ilyabirman.github.io/Likely/autoinit.html', { waitUntilInitialized: true })
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
            return getLikely(driver, 'http://ilyabirman.github.io/Likely/no-autoinit.html')
        });

        it('should change the shared URL when `<link rel="canonical">` is specified', function () {
            return driver.executeScript(`
                document.head.innerHTML += '<link rel="canonical" href="https://google.com">';
                likely.initiate();
            `).then(function () {
                return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*google\.com/);
            });
        });

        it('should change the shared URL when `data-url` is specified', function () {
            return driver.executeScript(`
                document.querySelector('.likely').setAttribute('data-url', 'https://google.com');
                likely.initiate();
            `).then(function () {
                return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*google\.com/);
            });
        });

        it('should change the shared title when `data-title` is specified', function () {
            return driver.executeScript(`
                document.querySelector('.likely').setAttribute('data-title', 'Fake Title');
                likely.initiate();
            `).then(function () {
                return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*Fake%20Title/);
            });
        });

        it('should set the `via` when `data-via` on the Twitter button is specified', function () {
            return driver.executeScript(`
                document.querySelector('.twitter').setAttribute('data-via', 'horse_js');
                likely.initiate();
            `).then(function () {
                return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*horse_js/);
            });
        });

        it('should set the shared text when `data-text` on the Telegram button is specified', function () {
            return driver.executeScript(`
                document.querySelector('.telegram').setAttribute('data-text', 'Fake Text');
                likely.initiate();
            `).then(function () {
                return expectClickToOpen(driver, '.likely__widget_telegram', /telegram\.me\/.*Fake%20Text/);
            });
        });

        it('should change the default image when the `data-media` on the Pinterest button is specified', function () {
            return driver.executeScript(`
                document.querySelector('.pinterest').setAttribute('data-media', 'http://i.imgur.com/zunNbfY.jpg');
                likely.initiate();
            `).then(function () {
                return expectClickToOpen(driver, '.likely__widget_pinterest', /pinterest\.com\/.*zunNbfY\.jpg/);
            });
        });
    });

    describe('history', function () {
        it('should change the shared URL when the URL hash is changed');
        it('should change the shared URL when history.pushState() is called');
        it('should change the shared URL when history.replaceState() is called');
    });

    describe('bugs', function () {
        it('should get a correct title when the script is placed before the title element [#67]', function () {
            return getLikely(driver, 'http://ilyabirman.github.io/Likely/issues/67.html', { waitUntilInitialized: true })
                .then(() => {
                    return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*Likely%20test%20page/)
                });
        });
    });
});

function getLikely(driver, url, { waitUntilInitialized = false} = {}) {
    const pagePromise = driver.get(url);

    if (waitUntilInitialized) {
        return pagePromise.then(function () {
            return driver.wait(until.elementLocated({css: '.likely_ready'}), 1500);
        });
    } else {
        return pagePromise;
    }
}

function expectToContainText(driver, selector, value) {
    return expect(driver.findElement({css: selector}).getText()).to.eventually.equal(value);
}

function expectClickToOpen(driver, clickTargetSelector, windowUrlRegex) {
    let originalWindowHandle;
    return driver.findElement({css: clickTargetSelector}).click()
        .then(function () {
            return Promise.all([
                driver.getWindowHandle(),
                driver.getAllWindowHandles()
            ]).then(function ([currentHandle, handles]) {
                originalWindowHandle = currentHandle;

                const newWindowHandle = handles.filter(h => h !== currentHandle)[0];
                return driver.switchTo().window(newWindowHandle);
            });
        })
        .then(function () {
            return expect(driver.getCurrentUrl()).to.eventually.match(windowUrlRegex);
        })
        .then(function () {
            return driver.close();
        })
        .then(function () {
            return driver.switchTo().window(originalWindowHandle);
        });
}