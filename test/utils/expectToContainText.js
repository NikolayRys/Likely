'use strict';

const expect = require('chai').use(require('chai-as-promised')).expect;

function expectToContainText(driver, selector, value) {
    return expect(driver.findElement({ css: selector }).getText()).to.eventually.equal(value);
}

module.exports = expectToContainText;
