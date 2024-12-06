const until = require('selenium-webdriver/lib/until');
const { By, error } = require('selenium-webdriver');
const { NoSuchElementError } = error;

/**
 * Finds all elements matching `shadowLocator` within the shadow roots of elements matching `lightLocator`.
 * Matches the behavior of `driver.findElements` in Selenium.
 * @param {WebDriver} driver - The Selenium WebDriver instance.
 * @param {string} shadowLocator - CSS selector for elements inside the shadow root.
 * @returns {Promise<WebElement[]>} A promise that resolves to an array of found elements.
 */
async function findShadowElements(driver, shadowLocator) {
    const lightLocator = By.className('likely'); // We have only one element with this class, no need to make it configurable
    const lightElements = await driver.findElements(lightLocator);
    const arraysOfElements = await Promise.all(
        lightElements.map(async (lightElement) => {
            return await lightElement.getShadowRoot().then((root) => root?.findElements(shadowLocator) ?? []);
        }),
    );
    return arraysOfElements.flat();
}

/**
 * Finds the first element matching `shadowLocator` within the shadow roots of elements matching `lightLocator`.
 * Throws a NoSuchElementError if no element is found, which is default behavior for Selenium.
 * Matches the behavior of `driver.findElement` in Selenium.
 * @param {WebDriver} driver - The Selenium WebDriver instance.
 * @param {string} shadowLocator - CSS selector for elements inside the shadow root.
 * @returns {Promise<WebElement>} A promise that resolves to the found element.
 */
async function findShadowElement(driver, shadowLocator) {
    const elements = await findShadowElements(driver, shadowLocator);
    if (elements.length === 0) {
        throw new NoSuchElementError(`No element found using shadow selector '${shadowLocator}' within light elements '${lightLocator}'.`);
    }
    return elements[0];
}

function atLeastOneShadowElementThatExists() {
    return async function (driver) {
        try {
            const elements = await findShadowElements(driver, By.className('likely_ready'));
            return elements.length > 0 ? elements[0] : false;
        }
        catch {
            return false;
        }
    };
}

async function shadowNavigation(driver) {
    const shadowLikely = await driver.wait(atLeastOneShadowElementThatExists(), 2000);
    await driver.wait(until.elementIsVisible(shadowLikely), 2000);
}

module.exports = {
    findShadowElements,
    findShadowElement,
    waitUntilLikelyInitialized: shadowNavigation,
};
