'use strict';

const { before, after, beforeEach, describe, it } = require('mocha');
const expect = require('chai').use(require('chai-as-promised')).expect;

require('chromedriver');
const selenium = require('selenium-webdriver');

const startServer = require('./utils/startServer');
const { LikelyPage, getLikelyPage } = require('./utils/getLikelyPage');
const waitUntilLikelyInitialized = require('./utils/waitUntilLikelyInitialized');
const expectToContainText = require('./utils/expectToContainText');
const expectClickToOpen = require('./utils/expectClickToOpen');

const commonTimeout = 20000;

describe('Likely', function () {
    let driver;

    // The timeout is used to handle the browser starting long for the first time
    // and sharing dialogs taking too long to load on a slow network
    this.timeout(commonTimeout);

    before(function () {
        driver = new selenium.Builder()
            .forBrowser('chrome')
            .build();

        startServer();
    });

    after(function () {
        return driver.quit();
    });

    describe('initialization', function () {
        beforeEach(function () {
            return getLikelyPage(driver, LikelyPage.NO_AUTOINIT_MULTIPLE);
        });

        it('should initialize without arguments', function () {
            return driver.executeScript('likely.initiate();')
                .then(() => waitUntilLikelyInitialized(driver))
                .then(() => driver.findElements({ css: '.likely' }))
                .then((allLikelyWidgets) => {
                    return expect(driver.findElements({ css: '.likely_ready' })).to.eventually.have.lengthOf(allLikelyWidgets.length);
                });
        });

        it('should initialize when only options are passed', function () {
            return driver.executeScript('likely.initiate({ url: "//google.com" });')
                .then(() => waitUntilLikelyInitialized(driver))
                .then(() => driver.findElements({ css: '.likely' }))
                .then((allLikelyWidgets) => {
                    const expectations = allLikelyWidgets.map(
                        (widget) => expectClickToOpen(
                            driver,
                            widget.findElement({ css: '.likely__widget_twitter' }),
                            /twitter\.com\/.*google\.com/
                        )
                    ).concat(
                        expect(driver.findElements({ css: '.likely_ready' }))
                            .to.eventually.have.lengthOf(allLikelyWidgets.length)
                    );

                    return Promise.all(expectations);
                });
        });

        it('should initialize a single node passed', function () {
            return driver.executeScript('likely.initiate(document.querySelector("#widget1"));')
                .then(() => waitUntilLikelyInitialized(driver))
                .then(() => {
                    return Promise.all([
                        expect(driver.findElement({ css: '#widget1' }).getAttribute('class'))
                            .to.eventually.include('likely_ready'),
                        expect(driver.findElements({ css: '.likely_ready' }))
                            .to.eventually.have.lengthOf(1),
                    ]);
                });
        });

        it('should initialize a single node passed with options', function () {
            return driver.executeScript(`
                likely.initiate(document.querySelector("#widget1"), { url: '//google.com' });
            `)
                .then(() => waitUntilLikelyInitialized(driver))
                .then(() => {
                    return Promise.all([
                        expect(driver.findElement({ css: '#widget1' }).getAttribute('class'))
                            .to.eventually.include('likely_ready'),
                        expect(driver.findElements({ css: '.likely_ready' }))
                            .to.eventually.have.lengthOf(1),
                        expectClickToOpen(driver, '#widget1 .likely__widget_twitter', /twitter\.com\/.*google\.com/),
                    ]);
                });
        });

        it('should initialize multiple nodes passed', function () {
            return driver.executeScript(`
                likely.initiate([document.querySelector("#widget1"), document.querySelector("#widget3")]);
            `)
                .then(() => waitUntilLikelyInitialized(driver))
                .then(() => {
                    return Promise.all([
                        expect(driver.findElement({ css: '#widget1' }).getAttribute('class'))
                            .to.eventually.include('likely_ready'),
                        expect(driver.findElement({ css: '#widget3' }).getAttribute('class'))
                            .to.eventually.include('likely_ready'),
                        expect(driver.findElements({ css: '.likely_ready' }))
                            .to.eventually.have.lengthOf(2),
                    ]);
                });
        });

        it('should initialize multiple nodes passed with options', function () {
            return driver.executeScript(`
                likely.initiate(
                    [document.querySelector("#widget1"), document.querySelector("#widget3")],
                    { url: '//google.com' }
                );
            `)
                .then(() => waitUntilLikelyInitialized(driver))
                .then(() => {
                    return Promise.all([
                        expect(driver.findElement({ css: '#widget1' }).getAttribute('class'))
                            .to.eventually.include('likely_ready'),
                        expect(driver.findElement({ css: '#widget3' }).getAttribute('class'))
                            .to.eventually.include('likely_ready'),
                        expect(driver.findElements({ css: '.likely_ready' }))
                            .to.eventually.have.lengthOf(2),
                        expectClickToOpen(driver, '#widget1 .likely__widget_twitter', /twitter\.com\/.*google\.com/),
                        expectClickToOpen(driver, '#widget3 .likely__widget_twitter', /twitter\.com\/.*google\.com/),
                    ]);
                });
        });
    });

    describe('changing configuration after being initialized', function () {
        beforeEach(function () {
            return getLikelyPage(driver, LikelyPage.AUTOINIT)
                .then(() => waitUntilLikelyInitialized(driver));
        });

        it('should change the shared URL when the new options are passed as a JS object', function () {
            return driver.executeScript(`
                likely.initiate({
                    url: 'http://google.com'
                });
            `)
                .then(function () {
                    return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*google\.com/);
                });
        });

        it('should change the shared URL when the new URL is specified on the node', function () {
            return driver.executeScript(`
                document.querySelector('.likely').setAttribute('data-url', 'http://google.com');
                likely.initiate();
            `)
                .then(function () {
                    return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*google\.com/);
                });
        });

        it('should change the shared URL when the new URL is specified as <link rel="canonical">', function () {
            return driver.executeScript(`
                const link = document.createElement('link');
                link.setAttribute('rel', 'canonical');
                link.setAttribute('href', 'http://google.com');
                document.head.appendChild(link);
                
                likely.initiate();
            `)
                .then(function () {
                    return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*google\.com/);
                });
        });
    });

    describe('fetching counters', function () {
        before(function () {
            return getLikelyPage(driver, LikelyPage.AUTOINIT)
                .then(() => waitUntilLikelyInitialized(driver));
        });

        const testedServices = [
            { name: 'Facebook', likelyName: 'facebook' },
            { name: 'Google+', likelyName: 'gplus' },
            { name: 'Odnoklassniki', likelyName: 'odnoklassniki' },
            { name: 'Pinterest', likelyName: 'pinterest' },
            { name: 'VK', likelyName: 'vkontakte' },
            { name: 'LinkedIn', likelyName: 'linkedin' },
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
            return getLikelyPage(driver, LikelyPage.AUTOINIT)
                .then(() => waitUntilLikelyInitialized(driver));
        });

        const testedServices = [
            { name: 'Facebook', likelyName: 'facebook', urlRegex: /facebook\.com/ },
            { name: 'Google+', likelyName: 'gplus', urlRegex: /plus\.google\.com/ },
            { name: 'Odnoklassniki', likelyName: 'odnoklassniki', urlRegex: /ok\.ru/ },
            { name: 'Pinterest', likelyName: 'pinterest', urlRegex: /pinterest\.com/ },
            { name: 'Telegram', likelyName: 'telegram', urlRegex: /telegram\.me/ },
            { name: 'Twitter', likelyName: 'twitter', urlRegex: /twitter\.com/ },
            { name: 'VK', likelyName: 'vkontakte', urlRegex: /vk\.com/ },
            { name: 'LinkedIn', likelyName: 'linkedin', urlRegex: /linkedin\.com/ },
        ];

        testedServices.forEach(({ name, likelyName, urlRegex }) => {
            it(`should open the sharing dialog for ${name}`, function () {
                return expectClickToOpen(driver, `.likely__widget_${likelyName}`, urlRegex);
            });
        });
    });

    describe('configuration', function () {
        beforeEach(function () {
            return getLikelyPage(driver, LikelyPage.NO_AUTOINIT);
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

            return getLikelyPage(driver, LikelyPage.AUTOINIT)
                .then(() => waitUntilLikelyInitialized(driver))
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

        it('should change the shared URL when the browser’s back button is clicked', function () {
            return getLikelyPage(driver, LikelyPage.NO_AUTOINIT)
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
                    return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*no-autoinit\.html/);
                });
        });
    });

    describe('bugs', function () {
        it('should get a correct title when the script is placed before the title element [#67]', function () {
            return getLikelyPage(driver, LikelyPage.ISSUE_67)
                .then(() => waitUntilLikelyInitialized(driver))
                .then(() => {
                    return expectClickToOpen(driver, '.likely__widget_twitter', /twitter\.com\/.*Likely%20test%20page/);
                });
        });
    });
});
