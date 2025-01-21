const { before, after, beforeEach, describe, it } = require('mocha');
const expect = require('chai').use(require('chai-as-promised')).expect;
const { Builder, Capabilities, By } = require('selenium-webdriver');
const { startServer, LikelyPage, getLikelyPage } = require('./utils/webpageNavigation');
const { findShadowElements, findShadowElement, waitUntilLikelyInitialized, getShadowElementClass, getShadowElementText } = require('./utils/shadowSelectors');
const { expectToContainText, expectClickToOpen } = require('./utils/lightSelectors');
require('chromedriver');

const commonTimeout = 20000;

describe('Likely', function () { // Mocha doesn't allow to pass arrowed function
    let driver;

    // The timeout is used to handle the browser starting long for the first time
    // and sharing dialogs taking too long to load on a slow network
    this.timeout(commonTimeout);

    before(() => {
        // Required for Travis
        const chromeOptions = { args: ['--no-sandbox'] };
        const chromeCapabilities = Capabilities.chrome();
        chromeCapabilities.set('chromeOptions', chromeOptions);
        driver = new Builder()
            .withCapabilities(chromeCapabilities)
            .build();

        startServer();
    });

    after(() => {
        return driver.quit();
    });

    describe('initialization', () => {
        beforeEach(() => {
            return getLikelyPage(driver, LikelyPage.NO_AUTOINIT_MULTIPLE);
        });

        it('initializes without arguments', async () => {
            await driver.executeScript('likely.initiate();');
            await waitUntilLikelyInitialized(driver);
            const allLikelyWidgets = await driver.findElements(By.css('.likely'));
            return expect(findShadowElements(driver, By.className('likely_ready'))).to.eventually.have.lengthOf(allLikelyWidgets.length);
        });

        it('initializes when only options are passed', async () => {
            await driver.executeScript('likely.initiate({ url: "//google.com" });');
            await waitUntilLikelyInitialized(driver);
            const allLikelyWidgets = await driver.findElements(By.css('.likely'));
            const expectations = [];
            for (let id = 0; id < allLikelyWidgets.length; id++) {
                expectations.push(await expectClickToOpen(
                    driver,
                    await findShadowElement(driver, By.css('.likely__widget_twitter')),
                    /x\.com\/.*google\.com/,
                ));
            }
            expectations.concat(
                expect(findShadowElements(driver, By.className('likely_ready'))).to.eventually.have.lengthOf(allLikelyWidgets.length),
            );
            return Promise.all(expectations);
        });

        it('initializes a single node passed indepently', async () => {
            await driver.executeScript('likely.initiate(document.querySelector("#widget1"));');
            await waitUntilLikelyInitialized(driver);
            return Promise.all([
                expect(getShadowElementClass(driver, By.className('likely'), By.id('widget1'))).to.eventually.include('likely_ready'),
                expect(findShadowElements(driver, By.className('likely_ready'), By.id('widget1'))).to.eventually.have.lengthOf(1),
            ]);
        });

        it('initializes a single node passed with options', async () => {
            await driver.executeScript('likely.initiate(document.querySelector("#widget1"), { url: \'//google.com\' });');
            await waitUntilLikelyInitialized(driver);
            return Promise.all([
                expect(getShadowElementClass(driver, By.className('likely'), By.id('widget1'))).to.eventually.include('likely_ready'),
                expect(findShadowElements(driver, By.className('likely_ready'), By.id('widget1'))).to.eventually.have.lengthOf(1),
                await expectClickToOpen(driver,
                    await findShadowElement(driver, By.className('likely__widget_twitter'), By.id('widget1')),
                    /x\.com\/.*google\.com/),
            ]);
        });

        it('initializes multiple nodes passed', async () => {
            await driver.executeScript(`
                likely.initiate([document.querySelector("#widget1"), document.querySelector("#widget3")]);
            `);

            await waitUntilLikelyInitialized(driver);
            return Promise.all([
                expect(getShadowElementClass(driver, By.className('likely'), By.id('widget1'))).to.eventually.include('likely_ready'),
                expect(getShadowElementClass(driver, By.className('likely'), By.id('widget3'))).to.eventually.include('likely_ready'),
                expect(findShadowElements(driver, By.className('likely_ready'))).to.eventually.have.lengthOf(2),
            ]);
        });

        it('initializes multiple nodes passed with options', async () => {
            await driver.executeScript(`
                likely.initiate(
                    [document.querySelector("#widget1"), document.querySelector("#widget3")],
                    { url: '//google.com' }
                );
            `);

            await waitUntilLikelyInitialized(driver);
            return Promise.all([
                expect(getShadowElementClass(driver, By.className('likely'), By.id('widget1'))).to.eventually.include('likely_ready'),
                expect(getShadowElementClass(driver, By.className('likely'), By.id('widget3'))).to.eventually.include('likely_ready'),
                expect(findShadowElements(driver, By.className('likely_ready'))).to.eventually.have.lengthOf(2),
                await expectClickToOpen(driver,
                    await findShadowElement(driver, By.className('likely__widget_twitter'), By.id('widget1')),
                    /x\.com\/.*google\.com/),
                await expectClickToOpen(driver,
                    await findShadowElement(driver, By.className('likely__widget_twitter'), By.id('widget3')),
                    /x\.com\/.*google\.com/),
            ]);
        });
    });

    describe('changing configuration after being initialized', () => {
        beforeEach(async () => {
            await getLikelyPage(driver, LikelyPage.AUTOINIT);
            await waitUntilLikelyInitialized(driver);
        });

        it('changes the shared URL when the new options are passed as a JS object', async () => {
            await driver.executeScript(`
                likely.initiate({
                    url: 'http://google.com'
                });
            `);
            return await expectClickToOpen(
                driver,
                await findShadowElement(driver, By.className('likely__widget_twitter')),
                /x\.com\/.*google\.com/);
        });

        it('changes the shared URL when the new URL is specified on the node', async () => {
            await driver.executeScript(`
                document.querySelector('.likely').setAttribute('data-url', 'http://google.com');
                likely.initiate();
            `);

            return await expectClickToOpen(
                driver,
                await findShadowElement(driver, By.className('likely__widget_twitter')),
                /x\.com\/.*google\.com/);
        });

        it('changes the shared URL when the new URL is specified as <link rel="canonical">', async () => {
            await driver.executeScript(`
                const link = document.createElement('link');
                link.setAttribute('rel', 'canonical');
                link.setAttribute('href', 'http://google.com');
                document.head.appendChild(link);

                likely.initiate();
            `);

            return await expectClickToOpen(
                driver,
                await findShadowElement(driver, By.className('likely__widget_twitter')),
                /x\.com\/.*google\.com/);
        });
    });

    describe('fetching counters', () => {
        before(async () => {
            await getLikelyPage(driver, LikelyPage.AUTOINIT);
            await waitUntilLikelyInitialized(driver);
        });

        const testedServices = [
            { name: 'Facebook', likelyName: 'facebook' },
            { name: 'Odnoklassniki', likelyName: 'odnoklassniki' },
            { name: 'Pinterest', likelyName: 'pinterest' },
            { name: 'Reddit', likelyName: 'reddit' },
            { name: 'VK', likelyName: 'vkontakte' },
        ];

        testedServices.forEach(({ name, likelyName }) => {
            it(`fetches the counters for ${name}`, async () => {
                const expectedCounterValue = '10';
                return await expect(getShadowElementText(driver, By.className(`likely__counter_${likelyName}`))).to.eventually.equal(expectedCounterValue);
            });
        });

        it('provide the number of __likelyFetchMock function calls', async () => {
            await driver.executeScript(`
                var el = document.createElement('span');
                el.setAttribute('id', '__likelyFetchMock');
                el.innerHTML = window.__likelyFetchMock.calls;
                document.body.appendChild(el);
            `);

            return expectToContainText(driver, '#__likelyFetchMock', '5');
        });
    });

    describe('opening sharing dialogs', () => {
        before(async () => {
            await getLikelyPage(driver, LikelyPage.AUTOINIT);
            await waitUntilLikelyInitialized(driver);
        });

        const testedServices = [
            { name: 'Facebook', likelyName: 'facebook', urlRegex: /facebook\.com/ },
            { name: 'Odnoklassniki', likelyName: 'odnoklassniki', urlRegex: /ok\.ru/ },
            { name: 'Pinterest', likelyName: 'pinterest', urlRegex: /pinterest\.com/ },
            { name: 'Telegram', likelyName: 'telegram', urlRegex: /telegram\.me/ },
            { name: 'Twitter', likelyName: 'twitter', urlRegex: /x\.com/ },
            { name: 'VK', likelyName: 'vkontakte', urlRegex: /vk\.com/ },
            { name: 'LinkedIn', likelyName: 'linkedin', urlRegex: /linkedin\.com/ },
            { name: 'Reddit', likelyName: 'reddit', urlRegex: /reddit\.com/ },
        ];

        testedServices.forEach(({ name, likelyName, urlRegex }) => {
            it(`opens the sharing dialog for ${name}`, async () => {
                return expectClickToOpen(
                    driver,
                    await findShadowElement(driver, By.className(`likely__widget_${likelyName}`)),
                    urlRegex);
            });
        });
    });

    describe('configuration', () => {
        beforeEach(() => {
            return getLikelyPage(driver, LikelyPage.NO_AUTOINIT);
        });

        it('changes the shared URL when `<link rel="canonical">` is specified', async () => {
            await driver.executeScript(`
                document.head.innerHTML += '<link rel="canonical" href="https://google.com">';
                likely.initiate();
            `);

            return expectClickToOpen(
                driver,
                await findShadowElement(driver, By.className('likely__widget_twitter')),
                /x\.com\/.*google\.com/);
        });

        it('changes the shared URL when `data-url` is specified', async () => {
            await driver.executeScript(`
                document.querySelector('.likely').setAttribute('data-url', 'https://google.com');
                likely.initiate();
            `);

            return expectClickToOpen(
                driver,
                await findShadowElement(driver, By.className('likely__widget_twitter')),
                /x\.com\/.*google\.com/);
        });

        it('changes the shared title when `data-title` is specified', async () => {
            await driver.executeScript(`
                document.querySelector('.likely').setAttribute('data-title', 'FakeTitle');
                likely.initiate();
            `);

            return expectClickToOpen(
                driver,
                await findShadowElement(driver, By.className('likely__widget_twitter')),
                /x\.com\/.*FakeTitle/);
        });

        it('sets the `via` when `data-via` on the Twitter button is specified', async () => {
            await driver.executeScript(`
                document.querySelector('.twitter').setAttribute('data-via', 'horse_js');
                likely.initiate();
            `);

            return expectClickToOpen(
                driver,
                await findShadowElement(driver, By.className('likely__widget_twitter')),
                /x\.com\/.*horse_js/);
        });

        it('sets the shared text when `data-title` on the Telegram button is specified', async () => {
            await driver.executeScript(`
                document.querySelector('.telegram').setAttribute('data-title', 'Fake Text');
                likely.initiate();
            `);

            return expectClickToOpen(
                driver,
                await findShadowElement(driver, By.className('likely__widget_telegram')),
                /telegram\.me\/.*Fake%20Text/);
        });

        it('opens popup for Pinterest', async () => {
            await driver.executeScript(`
                document.querySelector('.pinterest').setAttribute('data-media', 'http://i.imgur.com/zunNbfY.jpg');
                likely.initiate();
            `);

            return expectClickToOpen(
                driver,
                await findShadowElement(driver, By.className('likely__widget_pinterest')),
                /pinterest/);
        });
    });

    describe('history', () => {
        const testHistoryMethod = async (driver, methodName) => {
            // `methodName` is either "pushState" or "replaceState"

            const targetUrl = '/?history';

            await getLikelyPage(driver, LikelyPage.AUTOINIT);
            await waitUntilLikelyInitialized(driver);
            await driver.executeScript(`window.history.${methodName}(null, null, '${targetUrl}');`);
            return expectClickToOpen(
                driver,
                await findShadowElement(driver, By.className('likely__widget_twitter')),
                new RegExp(`x\\.com\\/.*${encodeURIComponent(targetUrl)}`));
        };

        it('changes the shared URL when history.pushState() is called', async () => {
            return testHistoryMethod(driver, 'pushState');
        });

        it('changes the shared URL when history.replaceState() is called', async () => {
            return testHistoryMethod(driver, 'replaceState');
        });

        it('changes the shared URL when the browser’s back button is clicked', async () => {
            await getLikelyPage(driver, LikelyPage.NO_AUTOINIT);

            await driver.executeScript(`
                window.history.pushState(null, null, '/?history');
                likely.initiate();
            `);
            await driver.navigate().back();

            return expectClickToOpen(
                driver,
                await findShadowElement(driver, By.className('likely__widget_twitter')),
                /x\.com\/.*no-autoinit\.html/,
            );
        });
    });

    describe('bugs', () => {
        it('gets a correct title when the script is placed before the title element [#67]', async () => {
            await getLikelyPage(driver, LikelyPage.ISSUE_67);
            await waitUntilLikelyInitialized(driver);
            return expectClickToOpen(
                driver,
                await findShadowElement(driver, By.className('likely__widget_twitter')),
                /x\.com\/.*LikelyTestPage/,
            );
        });
        it('does not make requests when counters are disabled [#145]', async () => {
            await getLikelyPage(driver, LikelyPage.ISSUE_145);
            await waitUntilLikelyInitialized(driver);
            await driver.executeScript(`
                var el = document.createElement('span');
                el.setAttribute('id', '__likelyFetchMock');
                el.innerHTML = window.__likelyFetchMock.calls;
                document.body.appendChild(el);
            `);
            return expectToContainText(driver, '#__likelyFetchMock', '0');
        });
    });

    describe('execute outside browser environment', () => {
        it('require without errors', () => {
            const likely = require('../release/likely-commonjs').initiate; // eslint-disable-line global-require
            expect(likely).to.be.an('function');
        });
    });
});
