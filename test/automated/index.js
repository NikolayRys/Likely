/* eslint-env node, mocha, es6 */

'use strict';

const { before, after, describe, it } = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

require('chromedriver');
const selenium = require('selenium-webdriver');

describe('Likely', function () {
    let driver;

    before(function () {
        driver = new selenium.Builder()
            .forBrowser('chrome')
            .build();
    });

    after(function () {
        return driver.quit();
    });

    describe('common operations', function () {
        const mockedCounterValue = '10';

        before(function () {
            // The browser could start long
            this.timeout(20000);

            return driver.get('http://ilyabirman.github.io/Likely/test.html')
                .then(function () {
                    // Give Likely time to initialize
                    return delay(1500);
                });
        });

        it('should initialize properly', function () {
            return expect(driver.findElement({css: '.likely'}).getAttribute('class')).to.eventually.contain('likely_visible likely_ready');
        });

        it('should fetch the counters for Facebook', function () {
            return expectToContainText(driver, '.likely__counter_facebook', mockedCounterValue);
        });

        it('should fetch the counters for Google+', function () {
            return expectToContainText(driver, '.likely__counter_gplus', mockedCounterValue);
        });

        it('should fetch the counters for Odnoklassniki', function () {
            return expectToContainText(driver, '.likely__counter_odnoklassniki', mockedCounterValue);
        });

        it('should fetch the counters for Pinterest', function () {
            return expectToContainText(driver, '.likely__counter_pinterest', mockedCounterValue);
        });

        it('should fetch the counters for VK', function () {
            return expectToContainText(driver, '.likely__counter_vkontakte', mockedCounterValue);
        });

        it('should open the sharing dialog for Facebook', function () {
            this.timeout(10000);
            return expectClickToOpen(driver, '.likely__widget_facebook', /facebook\.com/);
        });

        it('should open the sharing dialog for Google+', function () {
            this.timeout(10000);
            return expectClickToOpen(driver, '.likely__widget_gplus', /plus\.google\.com/);
        });

        it('should open the sharing dialog for Odnoklassniki', function () {
            this.timeout(10000);
            return expectClickToOpen(driver, '.likely__widget_odnoklassniki', /ok\.ru/);
        });

        it('should open the sharing dialog for Pinterest', function () {
            this.timeout(10000);
            return expectClickToOpen(driver, '.likely__widget_pinterest', /pinterest\.com/);
        });

        it('should open the sharing dialog for Telegram', function () {
            this.timeout(10000);
            return expectClickToOpen(driver, '.likely__widget_telegram', /telegram\.me/);
        });

        it('should open the sharing dialog for Twitter', function () {
            this.timeout(10000);
            return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com/);
        });

        it('should open the sharing dialog for VK', function () {
            this.timeout(10000);
            return expectClickToOpen(driver, '.likely__widget_vkontakte', /vk\.com/);
        });
    });

    describe('configuration', function () {
        it('should change the shared URL when `data-url` is specified');
        it('should change the shared title when `data-title` is specified');
        it('should set the `via` when `data-via` on the Twitter button is specified');
        it('should set the shared text when `data-text` on the Telegram button is specified');
        it('should change the default image when the `data-media` on the Pinterest button is specified');
    });

    describe('history', function () {
        it('should change the shared URL when URL hash is changed');
        it('should change the shared URL when history.pushState() is called');
        it('should change the shared URL when history.replaceState() is called');
    });

    describe('bugs', function () {
        it('should get a correct title when the script is placed before the title element [#67]');
    });
});

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
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